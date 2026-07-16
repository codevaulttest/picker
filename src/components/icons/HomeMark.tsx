interface HomeMarkProps {
  size?: number | string;
  className?: string;
  /** 品牌 Logo 无描边变体，此参数仅为向后兼容旧调用，不影响渲染 */
  strokeWidth?: number;
  filled?: boolean;
}

/** P 客品牌 Logo 轮廓，与 public/favicon.svg 同源（viewBox 0 0 72 72） */
const LOGO_MARK =
  "M36 0C55.8823 0 72 16.1178 72 36C72 55.8823 55.8823 72 36 72H21.9629V56.4932C25.957 59.2348 30.7914 60.8408 36.002 60.8408C49.7207 60.8408 60.8418 49.7197 60.8418 36.001C60.8417 22.2823 49.7207 11.1611 36.002 11.1611C22.2833 11.1612 11.1622 22.2823 11.1621 36.001C11.1621 36.0276 11.163 36.0544 11.1631 36.0732V72H0V36C0 16.1178 16.1178 0 36 0ZM36.002 21.9609C43.756 21.9609 50.0419 28.247 50.042 36.001C50.042 43.7551 43.756 50.041 36.002 50.041C28.272 50.0409 22.0017 43.7941 21.9629 36.0732V36.002H21.9619V36.001C21.962 28.247 28.248 21.961 36.002 21.9609Z";

/** 首页导航图标：复用品牌 Logo（favicon.svg 同款轮廓），颜色随 className 的 currentColor 切换激活/暗色态 */
export default function HomeMark({ size = 24, className }: HomeMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      className={className}
      aria-hidden
    >
      <path d={LOGO_MARK} fill="currentColor" />
    </svg>
  );
}
