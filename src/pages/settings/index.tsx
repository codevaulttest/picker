import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight, Shield, IdCard, Headset, ArrowLeftRight,
  Settings as SettingsIcon,
} from "lucide-react";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/mockBackend";
import PageHeader from "@/components/layout/PageHeader";
import PullToRefresh from "@/components/layout/PullToRefresh";
import RealNameDialog, { type RealNameInfo } from "@/components/dialogs/RealNameDialog";
import RealNameInfoDialog from "@/components/dialogs/RealNameInfoDialog";
import SwitchAccountSheet from "@/components/dialogs/SwitchAccountSheet";
import { createDemoRealNameInfo, extendExpireByOneYear, isExpiringSoon, isVerified } from "@/lib/realName";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [showRealName, setShowRealName] = useState(false);
  const [renewMode, setRenewMode] = useState(false);
  const [showRealNameInfo, setShowRealNameInfo] = useState(false);
  const [realNameInfo, setRealNameInfo] = useState<RealNameInfo | null>(null);

  const isDark = useStore((s) => s.isDark);
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);

  const guestName = t.home.guestName;
  const pkeId = localStorage.getItem("pke_user_id");

  const handleRefresh = async () => {
    const start = Date.now();
    if (pkeId) {
      const profile = await getUserProfile(pkeId);
      if (profile) {
        setUser({ ...user, ...profile, name: profile.name || profile.realName || guestName, avatar: profile.avatar || user?.avatar } as any);
        if (profile.assets) {
          const a: Record<string, number> = {};
          for (const [k, v] of Object.entries(profile.assets)) a[k] = typeof v === "string" ? Number(v) : (v as number);
          setAssets(a as any);
        }
      }
    }
    const elapsed = Date.now() - start;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));
  };

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";

  // 已认证但尚未在本次访问中采集过认证信息时，用演示数据兜底展示；到期日优先用账号上持久化的 verifyExpireAt
  const displayedRealNameInfo =
    realNameInfo ??
    (user && isVerified(user.verifyStatus)
      ? {
          ...createDemoRealNameInfo(user.pkeId),
          ...(user.verifyExpireAt ? { expireAt: user.verifyExpireAt } : {}),
        }
      : null);

  const menuItems = [
    {
      key: "security",
      label: t.settings.security,
      desc: t.settings.securityDesc,
      icon: Shield,
      color: GAME.infoBlue,
      bg: isDark ? GAME.infoSoftDark : GAME.infoSoft,
      action: () => navigate(user ? "/security" : "/login"),
    },
    {
      key: "support",
      label: t.settings.support,
      desc: t.settings.supportDesc,
      icon: Headset,
      color: GAME.primary,
      bg: isDark ? GAME.primarySoftDark : GAME.primarySoft,
      action: () => navigate("/support"),
    },
    {
      key: "settings",
      label: t.settings.generalEntry,
      desc: t.settings.generalDesc,
      icon: SettingsIcon,
      color: GAME.inkSecondary,
      bg: isDark ? GAME.bgMutedDark : GAME.bgMuted,
      action: () => navigate("/settings/general"),
    },
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-full flex flex-col transition-colors">
      <PageHeader
        avatar={user?.avatar}
        name={!user?.name || user.name === "游客" || user.name === "Guest" ? guestName : user.name}
        pkeId={user?.pkeId || pkeId || undefined}
        verifyStatus={user?.verifyStatus}
        level={user?.level || 1}
        loggedIn={!!user}
        onAvatarClick={() => navigate("/login")}
        onAvatarChange={(url) => setUser({ ...user, avatar: url } as any)}
        onNameChange={(name) => setUser({ ...user, name } as any)}
      />

      {user && !isVerified(user.verifyStatus) && user.verifyStatus !== 0 && (
        <section className="mx-3.5 mt-1 flex-shrink-0">
          <button
            onClick={() => setShowRealName(true)}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-card transition-colors active:brightness-95"
            style={{
              background:
                user.verifyStatus === 2
                  ? isDark ? GAME.errorSoftDark : GAME.errorSoft
                  : user.verifyStatus === 4 || user.verifyStatus === 6
                    ? isDark ? GAME.warningSoftDark : GAME.warningSoft
                    : isDark ? GAME.rewardGoldSoftDark : GAME.rewardGoldSoft,
            }}
          >
            <IdCard
              size={18}
              className="flex-shrink-0"
              style={{ color: user.verifyStatus === 2 ? GAME.error : user.verifyStatus === 4 || user.verifyStatus === 6 ? GAME.warning : GAME.rewardGold }}
            />
            <span className={`flex-1 text-left text-grid-label ${ink}`}>
              {user.verifyStatus === 2
                ? "认证被拒绝，去重新提交"
                : user.verifyStatus === 4
                  ? "资料不完整，去完善资料"
                  : user.verifyStatus === 6
                    ? "认证已过期，去重新认证"
                    : t.settings.verifyBanner}
            </span>
            <ChevronRight size={16} style={{ color: user.verifyStatus === 2 ? GAME.error : user.verifyStatus === 4 || user.verifyStatus === 6 ? GAME.warning : GAME.rewardGold }} />
          </button>
        </section>
      )}
      {user && user.verifyStatus === 0 && (
        <section className="mx-3.5 mt-1 flex-shrink-0">
          <div
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-card"
            style={{ background: isDark ? GAME.bgMutedDark : GAME.bgMuted }}
          >
            <IdCard size={18} className="flex-shrink-0" style={{ color: isDark ? GAME.inkSecondaryDark : GAME.inkSecondary }} />
            <span className={`flex-1 text-left text-grid-label ${inkSec}`}>认证审核中，请耐心等待</span>
          </div>
        </section>
      )}
      {user && user.verifyStatus === 1 && isExpiringSoon(user.verifyExpireAt) && (
        <section className="mx-3.5 mt-1 flex-shrink-0">
          <button
            onClick={() => setShowRealNameInfo(true)}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-card transition-colors active:brightness-95"
            style={{ background: isDark ? GAME.warningSoftDark : GAME.warningSoft }}
          >
            <IdCard size={18} className="flex-shrink-0" style={{ color: GAME.warning }} />
            <span className={`flex-1 text-left text-grid-label ${ink}`}>
              认证将于 {user.verifyExpireAt} 到期，请及时续费
            </span>
            <ChevronRight size={16} style={{ color: GAME.warning }} />
          </button>
        </section>
      )}

      {/* Menu list — single card, hairline dividers */}
      <section className="mx-3.5 mt-2.5 mb-4 pb-2 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === menuItems.length - 1;
            return (
              <button
                key={item.key}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                  isDark
                    ? "active:bg-game-bg-muted-dark"
                    : "active:bg-game-bg-muted/80"
                }`}
                style={
                  !isLast
                    ? {
                        borderBottom: `1px solid ${
                          isDark ? GAME.dividerDark : GAME.divider
                        }`,
                      }
                    : undefined
                }
              >
                <div
                  className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-grid-label truncate ${ink}`}>
                    {item.label}
                  </p>
                  <p className={`text-body truncate mt-0.5 ${inkSec}`}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight size={16} className={inkDis} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-3.5 mb-4 pb-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setShowSwitchAccount(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 min-h-14 rounded-card transition-colors ${softCard} ${
            isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80"
          }`}
        >
          <ArrowLeftRight size={18} className={inkSec} />
          <span className={`text-grid-label ${inkSec}`}>
            {t.settings.switchAccount}
          </span>
        </button>
      </section>

      <SwitchAccountSheet open={showSwitchAccount} onOpenChange={setShowSwitchAccount} />

      <RealNameDialog
        open={showRealName}
        mode={renewMode ? "renew" : "verify"}
        onClose={() => {
          setShowRealName(false);
          setRenewMode(false);
        }}
        onComplete={(info) => {
          setShowRealName(false);
          setRealNameInfo(info);
          if (user) setUser({ ...user, verifyStatus: 1, verifyExpireAt: info.expireAt } as any);
          toast({ title: "实名认证成功" });
        }}
        onRenewComplete={() => {
          setShowRealName(false);
          setRenewMode(false);
          if (!displayedRealNameInfo) return;
          const renewedExpireAt = extendExpireByOneYear(displayedRealNameInfo.expireAt);
          setRealNameInfo({ ...displayedRealNameInfo, expireAt: renewedExpireAt });
          if (user) setUser({ ...user, verifyStatus: 1, verifyExpireAt: renewedExpireAt } as any);
          toast({ title: "已续费，有效期延长 1 年" });
        }}
      />

      <RealNameInfoDialog
        open={showRealNameInfo}
        status={user?.verifyStatus}
        region={displayedRealNameInfo?.region}
        documentType={displayedRealNameInfo?.documentType}
        maskedName={displayedRealNameInfo?.maskedName}
        expireAt={displayedRealNameInfo?.expireAt}
        onClose={() => setShowRealNameInfo(false)}
        onRenew={() => {
          setShowRealNameInfo(false);
          setRenewMode(true);
          setShowRealName(true);
        }}
      />
    </div>
    </PullToRefresh>
  );
}
