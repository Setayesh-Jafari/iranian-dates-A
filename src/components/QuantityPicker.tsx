"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = cn(
    "grid place-items-center rounded-full text-date-700 transition-colors hover:bg-date-900/5 disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "h-7 w-7" : "h-9 w-9"
  );
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-date-900/12 bg-white",
        size === "sm" ? "px-1 py-0.5" : "px-1.5 py-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus size={iconSize} strokeWidth={2} />
      </button>
      <span
        className={cn(
          "text-center font-semibold tabular-nums text-date-900",
          size === "sm" ? "w-6 text-sm" : "w-8 text-base"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={iconSize} strokeWidth={2} />
      </button>
    </div>
  );
}
