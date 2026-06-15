/** Inline crest logo — an Aegis-style shield with a gem, themed to the dark UI. */
export function BrandLogo() {
  return (
    <svg
      className="brand-logo"
      viewBox="0 0 48 48"
      width="46"
      height="46"
      role="img"
      aria-label="Dota 2 Counters & Combos"
    >
      <defs>
        <linearGradient id="brandBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c2431" />
          <stop offset="1" stopColor="#0f141c" />
        </linearGradient>
        <linearGradient id="brandShield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4c863" />
          <stop offset="1" stopColor="#c5892b" />
        </linearGradient>
        <linearGradient id="brandGem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef6076" />
          <stop offset="1" stopColor="#c23c2a" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="13" fill="url(#brandBg)" stroke="#2a3342" strokeWidth="1.5" />
      <path
        d="M24 8c4.5 0 9 1.3 11.4 2.5.5 9.2-2.5 19.3-11.4 24.8C16.1 29.8 13.1 19.7 13.6 10.5 16 9.3 19.5 8 24 8z"
        fill="url(#brandShield)"
        stroke="#7c5a1d"
        strokeWidth="1"
      />
      <path d="M24 8c4.5 0 9 1.3 11.4 2.5.5 9.2-2.5 19.3-11.4 24.8z" fill="#000" opacity="0.12" />
      <path d="M24 17l5.2 6.2L24 31l-5.2-7.8z" fill="url(#brandGem)" stroke="#7a2218" strokeWidth="0.8" />
      <path d="M24 17l5.2 6.2L24 31z" fill="#000" opacity="0.16" />
    </svg>
  );
}
