import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useStore } from "@/stores";
import GemFilled from "@/components/icons/GemFilled";
import type { UserAssets } from "@/types";
import {
  GAME,
  ASSETS,
  ASSET_GROUPS,
  type AssetConfig,
} from "@/config/app.config";

function softForDark(soft: string): string {
  if (soft === GAME.primarySoft) return GAME.primarySoftDark;
  if (soft === GAME.infoSoft) return GAME.infoSoftDark;
  if (soft === GAME.successSoft) return GAME.successSoftDark;
  if (soft === GAME.rewardGoldSoft) return GAME.rewardGoldSoftDark;
  if (soft === GAME.errorSoft) return GAME.errorSoftDark;
  return GAME.bgMutedDark;
}

function hairline(isDark: boolean, show: boolean): CSSProperties | undefined {
  if (!show) return undefined;
  return { borderBottom: `1px solid ${isDark ? GAME.dividerDark : GAME.divider}` };
}

function assetValue(assets: UserAssets | null, key: string): number {
  const v = assets?.[key as keyof UserAssets];
  if (v == null) return 0;
  return typeof v === "number" ? v : Number(v) || 0;
}

export default function WealthPage() {
  const navigate = useNavigate();
  const assets = useStore((s) => s.assets);
  const isDark = useStore((s) => s.isDark);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";

  const gems = ASSETS.filter((a) => a.group === "gem").map((item) => ({
    ...item,
    value: assetValue(assets, item.key),
  }));

  const groups = ASSET_GROUPS.map((g) => ({
    ...g,
    items: ASSETS.filter((a) => a.group === g.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-full flex flex-col transition-colors pb-6">
      <header className="relative px-3.5 pt-3.5 pb-2">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1
            className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}
          >
            我的财富
          </h1>
        </div>
      </header>

      {/* 宝石：顶部卡片，横向排列 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`p-4 rounded-card transition-colors ${softCard}`}>
          <div className="grid grid-cols-3 gap-2">
            {gems.map((item) => (
              <GemCell
                key={item.key}
                item={item}
                value={item.value}
                isDark={isDark}
                ink={ink}
                inkSec={inkSec}
              />
            ))}
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.key} className="mx-3.5 mt-2.5 flex-shrink-0">
          <h2 className={`text-section-label uppercase mb-2 px-0.5 ${inkSec}`}>
            {group.title}
          </h2>
          <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
            {group.items.map((item, i) => (
              <AssetRow
                key={item.key}
                item={item}
                value={assetValue(assets, item.key)}
                isDark={isDark}
                showDivider={i < group.items.length - 1}
                ink={ink}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function IconBadge({ item, isDark }: { item: AssetConfig; isDark: boolean }) {
  const Icon = item.icon;
  const iconBg = isDark ? softForDark(item.soft) : item.soft;

  return (
    <div
      className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
      style={{ background: iconBg }}
    >
      {item.iconFilled ? (
        <GemFilled size={22} style={{ color: item.color }} />
      ) : Icon ? (
        <Icon size={18} strokeWidth={2} style={{ color: item.color }} />
      ) : (
        <span className="text-icon-badge" style={{ color: item.color }}>
          {item.badgeText}
        </span>
      )}
    </div>
  );
}

function GemCell({
  item,
  value,
  isDark,
  ink,
  inkSec,
}: {
  item: AssetConfig;
  value: number;
  isDark: boolean;
  ink: string;
  inkSec: string;
}) {
  return (
    <div className="flex flex-col items-center text-center min-w-0 gap-1.5">
      <IconBadge item={item} isDark={isDark} />
      <p className={`text-hud-number tabular-nums truncate w-full ${ink}`}>
        {value.toLocaleString()}
      </p>
      <p className={`text-section-label uppercase truncate w-full ${inkSec}`}>
        {item.label}
      </p>
    </div>
  );
}

function AssetRow({
  item,
  value,
  isDark,
  showDivider,
  ink,
}: {
  item: AssetConfig;
  value: number;
  isDark: boolean;
  showDivider: boolean;
  ink: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 min-h-14"
      style={hairline(isDark, showDivider)}
    >
      <IconBadge item={item} isDark={isDark} />
      <p className={`flex-1 min-w-0 text-grid-label ${ink}`}>{item.label}</p>
      <p className={`text-hud-number tabular-nums ${ink}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
