import { useId } from "react";
import type { LucideProps } from "lucide-react";

/**
 * Lucide ClipboardCheck 的填充态（库内无 filled 变体）。
 * 形制对齐 lucide clipboard-check：圆角板身 + 顶夹；对勾用 mask 挖空透出 FAB 底色。
 */
export default function ClipboardCheckFilled({
  size = 22,
  className,
  strokeWidth = 2.5,
}: LucideProps) {
  const uid = useId().replace(/:/g, "");
  const maskId = `clipboard-check-filled-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" />
          {/* 夹孔 */}
          <rect x="10" y="3" width="4" height="2" rx="0.5" fill="black" />
          {/* 对勾 — 同 Lucide `m9 14 2 2 4-4` */}
          <path
            d="m9 14 2 2 4-4"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* 闭合板身 + 顶夹（Lucide open path 的填充等价形） */}
        <path
          fill="currentColor"
          d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1Z"
        />
      </g>
    </svg>
  );
}
