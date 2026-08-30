"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/i18n/I18nProvider";
import { t } from "@/i18n";

// Neutral fallback used only when a product has no images attached.
// NOTE: placeholder imagery — not verified product photography.
const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/15913423/pexels-photo-15913423.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200&h=900";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const { dict } = useI18n();
  const [active, setActive] = useState(0);
  const imgs = images.length ? images : [FALLBACK_IMAGE];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-cream-200 shadow-[inset_0_0_0_1px_rgba(23,14,6,0.05)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={imgs[active]}
              alt={t(dict.product.galleryAlt, { name, index: active + 1 })}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {imgs.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t(dict.product.viewImage, { index: i + 1 })}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl bg-cream-200 transition-all duration-300",
              i === active
                ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-cream-50"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
