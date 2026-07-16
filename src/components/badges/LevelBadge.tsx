import { getLevel } from "@/config/app.config";

interface Props {
  level: number;
  showOriginal?: boolean;
  showEn?: boolean;
}

export default function LevelBadge({ level, showOriginal = false, showEn = true }: Props) {
  const info = getLevel(level);
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ color: info.color, backgroundColor: info.color + "15" }}
      >
        LV.{level}
      </span>
      {showOriginal && (
        <span className="text-[10px] text-slate-500">{info.originalName}</span>
      )}
      <span className="text-[10px] text-slate-600 font-medium">{info.cnName}</span>
      {showEn && (
        <span className="text-[9px] text-slate-400">{info.enName}</span>
      )}
    </div>
  );
}
