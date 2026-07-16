/** viewBox 高；与东家/知识宇宙 24vb×stroke2 对齐的默认描边 */
const VB_H = 56;
const PEER_STROKE = 2 * (VB_H / 24); // ≈4.67 → 缩到 24px 时视觉≈2px

interface ProfileMarkProps {
  size?: number | string;
  className?: string;
  /**
   * 描边宽（viewBox 54×56 单位）。
   * 默认对齐 DonorMark/Planet：24×24 里 strokeWidth=2 的视觉粗细。
   */
  strokeWidth?: number;
  /** Lucide 兼容；忽略，颜色一律 currentColor */
  fill?: string;
  /** 激活态：实心头肩，眼睛用 on-primary 留白；未激活：描边轮廓 */
  filled?: boolean;
}

/**
 * 「我的」导航图标 — 像素级复刻 design mock 底栏图标。
 * 形制：正圆头 + 竖胶囊双眼 + 扁圆角胶囊肩身；无图标库依赖。
 * viewBox 对齐设计截图量测坐标（54×56）。
 */
export default function ProfileMark({
  size = 24,
  className,
  strokeWidth = PEER_STROKE,
  filled = false,
}: ProfileMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 56"
      fill="none"
      className={className}
      aria-hidden
    >
      {filled ? (
        <>
          <circle cx="30" cy="22" r="17" fill="currentColor" />
          {/* 实心头上的眼睛：on-primary 留白，激活态 brand 底上仍可读 */}
          <rect
            x="21.7"
            y="19"
            width="3.4"
            height="5.6"
            rx="1.7"
            className="fill-game-on-primary"
          />
          <rect
            x="34.3"
            y="19"
            width="3.1"
            height="5.6"
            rx="1.55"
            className="fill-game-on-primary"
          />
          <rect x="16.5" y="40" width="27" height="12" rx="6" fill="currentColor" />
        </>
      ) : (
        <>
          <circle
            cx="30"
            cy="22"
            r="17"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <rect x="21.7" y="19" width="3.4" height="5.6" rx="1.7" fill="currentColor" />
          <rect x="34.3" y="19" width="3.1" height="5.6" rx="1.55" fill="currentColor" />
          <rect
            x="16.5"
            y="40"
            width="27"
            height="12"
            rx="6"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </>
      )}
    </svg>
  );
}
