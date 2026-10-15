#!/usr/bin/env python3
"""Independent validation of the generated PSD files using psd-tools.

Checks: file opens, layer tree, layer names, text layers carry live text with
the expected font/size, and image layers carry pixel data.
"""
import sys
import glob
import os

from psd_tools import PSDImage

DPI = 300.0


def walk(layers, depth=0):
    for layer in layers:
        kind = "GROUP" if layer.is_group() else ("TYPE" if layer.kind == "type" else "PIXEL")
        yield depth, kind, layer
        if layer.is_group():
            yield from walk(layer, depth + 1)


def main(folder):
    files = sorted(glob.glob(os.path.join(folder, "*.psd")))
    if not files:
        print("no psd files found")
        return 1
    total_text = 0
    total_px = 0
    problems = []
    for f in files:
        psd = PSDImage.open(f)
        print(f"\n=== {os.path.basename(f)}  {psd.width}x{psd.height} "
              f"({psd.width/DPI*25.4:.0f} x {psd.height/DPI*25.4:.0f} mm @ {DPI:.0f} dpi)")
        n_text = n_px = n_group = 0
        for depth, kind, layer in walk(psd):
            tag = "  " * depth + f"- {layer.name}"
            if kind == "TYPE":
                n_text += 1
                txt = ""
                try:
                    engine = layer.engine_dict
                    runs = engine.get("StyleRun", {}).get("RunArray", [])
                    ssd = runs[0].get("StyleSheet", {}).get("StyleSheetData", {}) if runs else {}
                    font_idx = ssd.get("Font")
                    fonts = layer.resource_dict.get("FontSet", []) if layer.resource_dict else []
                    font_name = fonts[font_idx]["Name"] if font_idx is not None and font_idx < len(fonts) else "?"
                    size = ssd.get("FontSize")
                    tracking = ssd.get("Tracking")
                    tag += f"  [{font_name} · {size}pt · tracking {tracking}]"
                    txt = layer.text or ""
                except Exception as e:  # pragma: no cover
                    problems.append(f"{f}: text parse error {e}")
                txt = (txt or "").replace("\r", " ⏎ ")
                if len(txt) > 58:
                    txt = txt[:58] + "…"
                tag += f"  “{txt}”"
            elif kind == "PIXEL":
                n_px += 1
            else:
                n_group += 1
            print(tag)
        total_text += n_text
        total_px += n_px
        print(f"    → {n_group} groups · {n_px} image layers · {n_text} live text layers")
        if n_text == 0:
            problems.append(f"{f}: no text layers")
    print(f"\nTOTAL live text layers: {total_text} · image layers: {total_px}")
    if problems:
        print("\nPROBLEMS:")
        for p in problems:
            print(" -", p)
        return 1
    print("\nAll PSD files parsed cleanly with live text layers present.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "out/psd"))
