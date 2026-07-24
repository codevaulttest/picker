import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Star, HelpCircle, ChevronRight, ChevronDown, ArrowRightLeft, Copy, HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { donate, getDonateLevels, getDonateOrders, getDonorAssets } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import {
  GAME, DONATE_CONFIG, STAR_LEVELS, LEVELS, getLevel, DONOR_ACTIONS,
} from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";

/** 等级图标映射 */
const LEVEL_ICONS: Record<number, string> = {
  1: "/icons/lv-长工.png", 2: "/icons/lv-贫农.png", 3: "/icons/lv-富农.png",
  4: "/icons/lv-队长.png", 5: "/icons/lv-村长.png", 6: "/icons/lv-乡长.png",
  7: "/icons/lv-镇长.png", 8: "/icons/lv-县令.png", 9: "/icons/lv-知府.png",
  10: "/icons/lv-巡抚.png", 11: "/icons/lv-太守.png", 12: "/icons/lv-丞相.png",
};

/** 升级码兑换列表 */
const UPGRADE_CODES = LEVELS.filter((l) => l.level >= 2).map((l) => ({
  level: l.level, name: l.cnName, bv: l.upgradeCost, color: l.color,
}));

const CTA_GRADIENT = `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`;
const CTA_LEDGE = `0 2px 0 ${GAME.primaryPressed}`;
/** on-primary — DESIGN.md；走 style 避免与 text-section-title 在 twMerge 冲突掉 text-white */
const CTA_STYLE = {
  background: CTA_GRADIENT,
  boxShadow: CTA_LEDGE,
  color: GAME.onPrimary,
} as const;

function softCard(isDark: boolean) {
  return isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
}

/** DONOR_ACTIONS soft → soft-dark */
function actionSoftDark(color: string): string {
  if (color === GAME.primary) return GAME.primarySoftDark;
  if (color === GAME.infoBlue) return GAME.infoSoftDark;
  if (color === GAME.success) return GAME.successSoftDark;
  if (color === GAME.rewardGold) return GAME.rewardGoldSoftDark;
  return GAME.bgMutedDark;
}

export default function DonorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const version = useStore((s) => s.donorVersion);
  const setVersion = useStore((s) => s.setDonorVersion);
  const isDark = useStore((s) => s.isDark);
  const { t } = useI18n();
  const [showVer, setShowVer] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeTab, setExchangeTab] = useState<"upgrade" | "auth">("upgrade");
  const [authCount, setAuthCount] = useState(1);
  const [showRisk, setShowRisk] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [selLevel, setSelLevel] = useState(2);
  const [payAsset, setPayAsset] = useState<"BV" | "DOS">("BV");

  const { data: assets } = useQuery({
    queryKey: ["donor", "assets", user?.userId],
    queryFn: () => getDonorAssets(user?.pkeId),
    enabled: !!user,
  });
  const { data: levels = [] } = useQuery({ queryKey: ["donor", "levels"], queryFn: async () => getDonateLevels() });
  const { data: orders = [] } = useQuery({
    queryKey: ["donor", "orders", user?.userId],
    queryFn: () => getDonateOrders(),
    enabled: !!user,
  });

  const donateMut = useMutation({
    mutationFn: (vars: { userId: number; targetLevel: number; version: string; payAsset: "BV" | "DOS" }) =>
      donate(vars.targetLevel, vars.payAsset),
    onSuccess: () => { toast({ title: "打赏成功" }); setShowLevel(false); },
  });

  const currentLevel = levels.find((l) => l.level === selLevel);
  const starLv = assets ? Math.min(6, Math.floor(Number(assets.totalBvIncome) / 10000)) : 0;
  /** 无真实邀请码时用 6 位占位假数据 */
  const inviteCode = user?.inviteCode?.replace(/\D/g, "").slice(0, 6) || "846291";

  const authCost = authCount * 1000;
  const authBonus = authCount >= 10 ? Math.floor(authCount * 0.3) : 0;
  const totalAuth = authCount + authBonus;
  const dosAmount = currentLevel ? Math.ceil(currentLevel.bv / DONATE_CONFIG.dosBvRate) : 0;

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const mutedSurface = isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted";
  const dialogSurface = isDark ? "bg-game-bg-card-dark" : undefined;
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({ title: "已复制邀请码" });
  };

  const handleAction = (key: string, path: string, needsRisk?: boolean) => {
    if (needsRisk) setShowRisk(true);
    else navigate(path);
  };

  return (
    <div className="min-h-full flex flex-col transition-colors">
      {/* Header */}
      <header className="px-3.5 py-3 flex items-center gap-2 flex-shrink-0">
        <h1 className={`flex-1 text-identity-name ${ink}`}>{t.donor.title}</h1>
        <button
          onClick={() => setShowVer(true)}
          className={`flex items-center gap-0.5 pl-2.5 pr-1.5 py-1 rounded-pill text-caption font-semibold tabular-nums active:scale-95 transition-transform border ${
            isDark
              ? "border-game-border-light-dark bg-game-bg-card-dark text-game-primary-text"
              : "border-game-border-light bg-game-bg-card text-game-primary-text shadow-xs"
          }`}
          aria-label="切换版本"
        >
          {version === "ASIA" ? t.donor.asia : t.donor.global}
          <ChevronDown size={12} strokeWidth={2.5} className="opacity-70" />
        </button>
      </header>

      {/* 星级 + 邀请码 */}
      <section className="mx-3.5 mt-1 flex-shrink-0">
        <div className={`p-4 rounded-card flex items-center justify-between transition-colors ${softCard(isDark)}`}>
          <button
            onClick={() => setShowStar(true)}
            className="flex items-center gap-1.5 active:scale-95 transition-transform"
            aria-label="东家星级"
          >
            <span className={`text-body ${inkSec}`}>东家星级</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 6 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < starLv ? "text-game-reward-gold fill-game-reward-gold" : inkDis}
                />
              ))}
            </div>
            <HelpCircle size={14} className={inkDis} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-body ${inkSec}`}>邀请码</span>
            <div
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-button"
              style={{
                background: isDark ? GAME.rewardGoldSoftDark : GAME.rewardGoldSoft,
              }}
            >
              <span
                className="text-hud-number tabular-nums"
                style={{ color: isDark ? GAME.inkDark : GAME.ink }}
              >
                {inviteCode}
              </span>
              <button
                onClick={handleCopyInvite}
                className="p-0.5 active:scale-90 transition-transform"
                aria-label="复制邀请码"
              >
                <Copy size={13} className={isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BV兑换专区 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <button
          onClick={() => setShowExchange(true)}
          className={`w-full p-4 rounded-card flex items-center justify-between active:scale-[0.98] transition-transform ${softCard(isDark)}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-button flex items-center justify-center flex-shrink-0"
              style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
            >
              <ArrowRightLeft size={22} strokeWidth={2} style={{ color: GAME.primary }} />
            </div>
            <div className="text-left">
              <p className={`text-grid-label ${ink}`}>BV兑换专区</p>
              <p className={`text-body mt-0.5 ${inkSec}`}>升级码 / 认证码兑换</p>
            </div>
          </div>
          <ChevronRight size={18} className={inkDis} />
        </button>
      </section>

      {/* 功能宫格 */}
      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`p-2 rounded-card transition-colors ${softCard(isDark)}`}>
          <div className="grid grid-cols-3">
            {DONOR_ACTIONS.map((a, i) => {
              const Icon = a.icon;
              const isRightEdge = (i + 1) % 3 === 0;
              const isBottomRow = i >= 3;
              return (
                <button
                  key={a.key}
                  onClick={() => handleAction(a.key, a.path, a.needsRiskConfirm)}
                  className={`flex flex-col items-center py-3 active:scale-95 transition-all ${!isRightEdge ? "border-r-hairline" : ""} ${!isBottomRow ? "border-b-hairline" : ""}`}
                  style={{ borderColor: isDark ? GAME.dividerDark : GAME.divider }}
                >
                  <div
                    className="w-14 h-14 rounded-tile flex items-center justify-center"
                    style={{ backgroundColor: isDark ? actionSoftDark(a.color) : a.bg }}
                  >
                    <Icon size={26} strokeWidth={2} color={a.color} />
                  </div>
                  <span className={`text-grid-label mt-2 ${ink}`}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 最近打赏 */}
      <section className="mx-3.5 mt-2.5 mb-4">
        <h3 className={`text-section-title mb-2.5 ${ink}`}>最近打赏</h3>
        {orders.slice(0, 5).map((o) => (
          <button
            key={o.id}
            onClick={() => navigate(`/donor/order/${o.id}`)}
            className="w-full mb-2"
          >
            <div className={`p-3 rounded-card flex items-center justify-between active:scale-[0.98] transition-transform text-left ${softCard(isDark)}`}>
              <div className="flex items-center gap-3">
                {LEVEL_ICONS[o.targetLevel] && (
                  <img src={LEVEL_ICONS[o.targetLevel]} alt="" className="w-8 h-8 object-contain" />
                )}
                <span className={`text-body ${inkSec}`}>{getLevel(o.targetLevel).cnName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-hud-number tabular-nums ${ink}`}>
                  {Number(o.payAmount).toLocaleString()}{" "}
                  <span className={`text-caption font-normal ${inkSec}`}>{o.payAsset}</span>
                </span>
                <ChevronRight size={16} className={inkDis} />
              </div>
            </div>
          </button>
        ))}
        {orders.length === 0 && (
          <div className={`flex flex-col items-center px-4 py-8 gap-3 rounded-card ${softCard(isDark)}`}>
            <div
              className="w-14 h-14 rounded-tile flex items-center justify-center"
              style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
            >
              <HandCoins size={28} strokeWidth={1.75} style={{ color: GAME.primary }} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className={`text-section-title ${ink}`}>{t.donor.noOrders}</p>
              <p className={`text-body ${inkSec}`}>{t.donor.noOrdersHint}</p>
            </div>
            <Button
              onClick={() => setShowRisk(true)}
              className="mt-1 h-11 min-w-32 px-6 rounded-button text-section-title border-0"
              style={CTA_STYLE}
            >
              {t.donor.goDonate}
            </Button>
          </div>
        )}
      </section>

      {/* ═════════════════════ 弹窗 ═════════════════════ */}

      <Dialog open={showStar} onOpenChange={setShowStar}>
        <DialogContent className={dialogSurface}>
          <DialogHeader>
            <DialogTitle>东家星级说明</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-button text-center ${isDark ? "bg-game-info-soft-dark" : "bg-game-info-soft"}`}
            >
              <p className={`text-caption mb-1 ${inkSec}`}>当前点数</p>
              <p className="text-hero-number tabular-nums text-game-primary-text">
                {assets ? Number(assets.totalBvIncome || 0).toLocaleString() : "0"}
              </p>
              <p className={`text-caption mt-1 ${inkSec}`}>
                1 BV打赏 = 1点数 / 1 DOS = {DONATE_CONFIG.dosBvRate}点数
              </p>
            </div>
            <div
              className="text-center p-3 rounded-button"
              style={{ background: isDark ? GAME.rewardGoldSoftDark : GAME.rewardGoldSoft }}
            >
              <p className={`text-caption ${inkSec}`}>当前星级</p>
              <div className="flex justify-center gap-1 mt-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < starLv ? "text-game-reward-gold fill-game-reward-gold" : inkDis}
                  />
                ))}
              </div>
              <p className={`text-identity-name mt-1 ${ink}`}>
                {starLv}星 · {STAR_LEVELS.find((s) => s.star === starLv)?.label || "新星"}
              </p>
              {starLv < 6 && (
                <p className={`text-caption mt-1 ${inkSec}`}>
                  距下一级还需{" "}
                  {(STAR_LEVELS.find((s) => s.star === starLv + 1)?.min || 0) - Number(assets?.totalBvIncome || 0)}{" "}
                  点数
                </p>
              )}
            </div>
            <div className="space-y-1">
              {STAR_LEVELS.map((s) => (
                <div
                  key={s.star}
                  className={`flex items-center justify-between p-2.5 rounded-tile ${
                    s.star === starLv ? (isDark ? "bg-game-reward-gold-soft-dark" : "bg-game-reward-gold-soft") : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-game-reward-gold fill-game-reward-gold" />
                    <span className={`text-body font-semibold ${ink}`}>{s.star}星 · {s.label}</span>
                  </div>
                  <span className={`text-caption tabular-nums ${inkSec}`}>
                    {s.min.toLocaleString()} ~ {s.max === 10000000 ? "∞" : s.max.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExchange} onOpenChange={setShowExchange}>
        <DialogContent className={dialogSurface}>
          <DialogHeader>
            <DialogTitle>BV兑换专区</DialogTitle>
          </DialogHeader>
          <div className={`flex rounded-button p-1 ${mutedSurface}`}>
            <button
              onClick={() => setExchangeTab("upgrade")}
              className={`flex-1 py-2.5 rounded-tile text-body font-semibold transition-all ${
                exchangeTab === "upgrade"
                  ? isDark ? "bg-game-bg-card-dark text-game-ink-dark shadow-sm" : "bg-game-bg-card text-game-ink shadow-sm"
                  : inkSec
              }`}
            >
              升级码兑换
            </button>
            <button
              onClick={() => setExchangeTab("auth")}
              className={`flex-1 py-2.5 rounded-tile text-body font-semibold transition-all ${
                exchangeTab === "auth"
                  ? isDark ? "bg-game-bg-card-dark text-game-ink-dark shadow-sm" : "bg-game-bg-card text-game-ink shadow-sm"
                  : inkSec
              }`}
            >
              认证码兑换
            </button>
          </div>
          {exchangeTab === "upgrade" && (
            <div className="space-y-1">
              <div className={`flex items-center justify-between py-2 px-1 text-caption font-semibold ${inkSec}`}>
                <span>等级</span><span>所需BV</span>
              </div>
              {UPGRADE_CODES.map((u) => (
                <div
                  key={u.level}
                  className={`flex items-center justify-between p-3 rounded-button ${mutedSurface}`}
                >
                  <div className="flex items-center gap-2">
                    {LEVEL_ICONS[u.level] && <img src={LEVEL_ICONS[u.level]} alt="" className="w-7 h-7 object-contain" />}
                    <span className={`text-body font-semibold ${ink}`}>{u.name}</span>
                  </div>
                  <span className="text-hud-number tabular-nums text-game-primary-text">{u.bv.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          {exchangeTab === "auth" && (
            <div className="space-y-4">
              <div
                className={`p-3 rounded-button text-center ${isDark ? "bg-game-info-soft-dark" : "bg-game-info-soft"}`}
              >
                <p className={`text-body font-semibold ${ink}`}>1000 BV = 1 认证码</p>
                <p className={`text-caption mt-1 ${inkSec}`}>兑换10个赠送3个，兑换20个赠送6个</p>
              </div>
              <div>
                <label className={`text-body font-semibold mb-2 block ${ink}`}>兑换数量</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAuthCount(Math.max(1, authCount - 1))}
                    className={`w-10 h-10 rounded-button text-lg font-bold active:scale-90 transition-transform ${mutedSurface} ${isDark ? "text-game-ink-dark" : "text-game-ink-secondary"}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={authCount}
                    onChange={(e) => setAuthCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`flex-1 h-12 text-center text-hud-number tabular-nums rounded-button border outline-none ${isDark ? "bg-game-bg-muted-dark border-game-border-light-dark text-game-ink-dark" : "bg-game-bg-card border-game-border-light text-game-ink"}`}
                  />
                  <button
                    onClick={() => setAuthCount(authCount + 1)}
                    className={`w-10 h-10 rounded-button text-lg font-bold active:scale-90 transition-transform ${mutedSurface} ${isDark ? "text-game-ink-dark" : "text-game-ink-secondary"}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={`p-3 rounded-button ${mutedSurface}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-body ${inkSec}`}>消耗BV</span>
                  <span className="text-hud-number tabular-nums text-game-primary-text">{authCost.toLocaleString()}</span>
                </div>
                {authBonus > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-body ${inkSec}`}>赠送数量</span>
                    <span className="text-hud-number tabular-nums text-game-success">+{authBonus}</span>
                  </div>
                )}
                <div className="border-t border-dashed my-2 border-game-divider" />
                <div className="flex justify-between items-center">
                  <span className={`text-body font-semibold ${ink}`}>合计获得</span>
                  <span className="text-identity-name tabular-nums text-game-primary-text">{totalAuth} 个</span>
                </div>
              </div>
              <Button
                className="w-full h-12 rounded-button text-section-title border-0"
                style={CTA_STYLE}
              >
                确认兑换
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showVer} onOpenChange={setShowVer}>
        <DialogContent className={dialogSurface}>
          <DialogHeader>
            <DialogTitle>{t.donor.versionSwitch}</DialogTitle>
          </DialogHeader>
          <p
            className={`text-body p-3 rounded-button text-left ${ink}`}
            style={{ background: isDark ? GAME.primarySoftDark : GAME.primarySoft }}
          >
            {t.donor.versionTip}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className={`h-12 rounded-button text-section-title ${outlineBtn}`}
              onClick={() => setShowVer(false)}
            >
              {t.donor.cancel}
            </Button>
            <Button
              className="h-12 rounded-button text-section-title border-0"
              style={CTA_STYLE}
              onClick={() => {
                setVersion(version === "ASIA" ? "GLOBAL" : "ASIA");
                setShowVer(false);
              }}
            >
              {t.donor.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRisk} onOpenChange={setShowRisk}>
        <DialogContent showCloseButton={false} className={dialogSurface}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <span className="text-game-warning" aria-hidden>⚠</span>
              {t.donor.riskTitle}
            </DialogTitle>
          </DialogHeader>
          <div className={`max-h-40 overflow-y-auto text-body space-y-2 leading-relaxed text-left ${inkSec}`}>
            {t.donor.riskContent.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className={`h-12 rounded-button text-section-title ${outlineBtn}`}
              onClick={() => setShowRisk(false)}
            >
              {t.donor.checkLater}
            </Button>
            <Button
              className="h-12 rounded-button text-section-title border-0"
              style={CTA_STYLE}
              onClick={() => { setShowRisk(false); setShowLevel(true); }}
            >
              {t.donor.known}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLevel} onOpenChange={setShowLevel}>
        <DialogContent className={dialogSurface}>
          <DialogHeader>
            <DialogTitle>{t.donor.selectLevel}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((l) => {
              const selected = selLevel === l.level;
              return (
                <button
                  key={l.level}
                  onClick={() => setSelLevel(l.level)}
                  className="p-2.5 rounded-button border text-center transition-colors"
                  style={{
                    borderColor: selected ? GAME.primary : (isDark ? GAME.borderLightDark : GAME.borderLight),
                    background: selected
                      ? (isDark ? GAME.primarySoftDark : GAME.primarySoft)
                      : "transparent",
                  }}
                >
                  {LEVEL_ICONS[l.level] && (
                    <img src={LEVEL_ICONS[l.level]} alt="" className="w-8 h-8 object-contain mx-auto mb-1" />
                  )}
                  <div className={`text-body font-semibold ${ink}`}>{l.name}</div>
                  <div className={`text-caption ${inkSec}`}>Lv.{l.level}</div>
                  <div className="text-hud-number tabular-nums mt-1 text-game-primary-text">{l.bv}BV</div>
                </button>
              );
            })}
          </div>
          {currentLevel && (
            <div className="flex gap-3">
              {(["BV", "DOS"] as const).map((asset) => {
                const selected = payAsset === asset;
                const label = asset === "BV"
                  ? `${t.donor.payBv} ${currentLevel.bv}`
                  : `${t.donor.payDos} ${dosAmount}`;
                return (
                  <button
                    key={asset}
                    onClick={() => setPayAsset(asset)}
                    className="flex-1 py-2.5 rounded-button text-body font-semibold border transition-colors"
                    style={{
                      borderColor: selected ? GAME.primary : (isDark ? GAME.borderLightDark : GAME.borderLight),
                      background: selected
                        ? (isDark ? GAME.primarySoftDark : GAME.primarySoft)
                        : "transparent",
                      color: selected ? GAME.primaryText : (isDark ? GAME.inkSecondaryDark : GAME.inkSecondary),
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
          <Button
            className="w-full h-12 rounded-button text-section-title border-0"
            style={CTA_STYLE}
            onClick={() => user && donateMut.mutate({ userId: user.userId, targetLevel: selLevel, version, payAsset })}
            disabled={donateMut.isPending}
          >
            {donateMut.isPending
              ? "..."
              : `${t.donor.confirmDonate} ${payAsset === "BV" ? (currentLevel?.bv || 0) + " BV" : dosAmount + " DOS"}`}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
