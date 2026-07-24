import { useId } from "react";
import type { LucideProps } from "lucide-react";

/**
 * Lucide Gem 的填充态（库内无 filled 变体）。
 * 形制对齐 lucide gem：主体用 currentColor 实心填充，分面线用 mask 挖空透出色块底色。
 */
export default function GemFilled({
  size = 18,
  className,
  style,
  strokeWidth = 1.5,
}: LucideProps) {
  const uid = useId().replace(/:/g, "");
  const maskId = `gem-filled-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" />
          {/* 分面线 — 同 Lucide 顶部尖角折线 + 横向腰线 */}
          <path
            d="M10.5 3 8 9l4 13 4-13-2.5-6"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M2 9h20"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <path
          fill="currentColor"
          d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"
        />
      </g>
    </svg>
  );
}
