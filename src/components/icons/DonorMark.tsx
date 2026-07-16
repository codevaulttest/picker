interface DonorMarkProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  /** Lucide 兼容；本图标为描边，忽略 fill */
  fill?: string;
}

/**
 * 「东家」导航图标 — 像素级复刻 design mock 底栏图标。
 * 形制：闭合心形轮廓 + 内嵌握手折线 + 两道手指短划（Lucide classic heart-handshake）。
 * 颜色随 className 的 currentColor 切换激活/暗色态。
 */
export default function DonorMark({
  size = 24,
  className,
  strokeWidth = 2,
}: DonorMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Heart silhouette */}
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handshake clasp from cleft */}
      <path
        d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Finger ticks */}
      <path
        d="m18 15-2-2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m15 18-2-2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
