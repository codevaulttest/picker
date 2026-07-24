/**
 * 通用下拉刷新容器：贴顶下拉触发 onRefresh，松手回弹。
 * 手势逻辑对齐首页「下拉唤出小程序」的实现方式（含 dragRef 判断避免过渡动画打架）。
 */
import { useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { GAME } from "@/config/app.config";

const PULL_RESISTANCE = 0.5;
const PULL_THRESHOLD = 56;

export default function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dragRef = useRef<{ dragging: boolean; startY: number; pointerId: number }>({
    dragging: false,
    startY: 0,
    pointerId: -1,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (refreshing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const scrollEl = containerRef.current?.closest("main");
    if (!scrollEl || scrollEl.scrollTop > 0) return;
    dragRef.current = { dragging: true, startY: e.clientY, pointerId: e.pointerId };
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    const delta = e.clientY - d.startY;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    e.preventDefault();
    setPullDistance(Math.min(PULL_THRESHOLD * 1.4, delta * PULL_RESISTANCE));
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    d.dragging = false;
    setPullDistance((cur) => {
      if (cur >= PULL_THRESHOLD) {
        setRefreshing(true);
        Promise.resolve(onRefresh()).finally(() => {
          setRefreshing(false);
          setPullDistance(0);
        });
        return PULL_THRESHOLD;
      }
      return 0;
    });
  };

  const displayDistance = refreshing ? PULL_THRESHOLD : pullDistance;
  const ratio = Math.min(1, displayDistance / PULL_THRESHOLD);
  const label = refreshing ? "正在刷新…" : ratio >= 1 ? "松开刷新" : "下拉刷新";

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="flex items-center justify-center gap-1.5 overflow-hidden"
        style={{
          height: displayDistance,
          transition: dragRef.current.dragging ? "none" : "height 0.28s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Loader2Icon
          size={16}
          className={refreshing ? "animate-spin" : ""}
          style={{
            color: GAME.primary,
            opacity: ratio,
            transform: refreshing ? undefined : `rotate(${ratio * 360}deg)`,
          }}
        />
        <span
          className="text-caption text-game-ink-secondary dark:text-game-ink-secondary-dark"
          style={{ opacity: ratio }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
