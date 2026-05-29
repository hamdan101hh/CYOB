import type { LucideIcon } from "lucide-react";

export function VisualThumbnail({
  title,
  subtitle,
  gradient,
  icon: Icon,
  aspect = "video",
}: {
  title: string;
  subtitle?: string;
  gradient: string;
  icon?: LucideIcon;
  aspect?: "video" | "square" | "wide";
}) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[2/1]"
        : "aspect-[4/3]";

  return (
    <div
      className={`stealth-card relative overflow-hidden rounded-[var(--radius-md)] ${aspectClass}`}
    >
      <div className={`absolute inset-0 ${gradient}`} />
      {Icon ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Icon className="h-10 w-10 text-white" strokeWidth={1} aria-hidden />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-xs font-medium text-white/95">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-[10px] text-white/55">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
