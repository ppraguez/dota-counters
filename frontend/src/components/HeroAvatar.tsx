import { useState } from "react";

interface Props {
  src: string;
  name: string;
  /** Width in px; height follows the 16:9 hero-banner ratio. */
  width: number;
  className?: string;
}

/** Hero banner image with a graceful initials fallback if the CDN image fails to load. */
export function HeroAvatar({ src, name, width, className }: Props) {
  const [failed, setFailed] = useState(false);
  const height = Math.round((width * 9) / 16);

  const initials = name
    .split(/[\s'-]+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <span
        className={`avatar avatar--fallback ${className ?? ""}`}
        style={{ width, height }}
        aria-hidden="true"
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      className={`avatar ${className ?? ""}`}
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
