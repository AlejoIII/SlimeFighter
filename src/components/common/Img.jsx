import React from "react";

const PLACEHOLDER_SPRITE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">sprite not found</text></svg>`
  );

const PLACEHOLDER_BG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cffafe"/><stop offset="100%" stop-color="#bbf7d0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="#0f172a">background not found</text></svg>`
  );

export default function Img({ src, alt, className, kind = "sprite" }) {
  const fallback = kind === "bg" ? PLACEHOLDER_BG : PLACEHOLDER_SPRITE;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
}
