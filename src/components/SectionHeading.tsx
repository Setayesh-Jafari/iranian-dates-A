import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-gold-300" : "text-gold-600",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-6 bg-current opacity-50" />
          {eyebrow}
          {align === "center" && <span className="h-px w-6 bg-current opacity-50" />}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-4xl md:text-[2.75rem]",
          light ? "text-cream-50" : "text-date-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-cream-100/70" : "text-date-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
