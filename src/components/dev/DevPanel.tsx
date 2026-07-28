import { useState } from "react";
import { Wrench, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { THEME, BRAND } from "@/config/app.config";
import { registerUser } from "@/lib/mockBackend";
import { demoDateDaysFromNow, isExpiringSoon } from "@/lib/realName";
import type { UserProfile } from "@/types";

const EXPIRING_SOON_DEMO_DAYS = 20;
const VERIFIED_DEMO_DAYS = 365 * 3;

/** 「即将到期」不是独立的后端状态，而是 verifyStatus=1 叠加临近的 verifyExpireAt，因此单独建模，不能简单按 verifyStatus 一一对应 */
const VERIFY_STATUS_ITEMS: {
  key: string;
  short: string;
  active: (u: UserProfile | null) => boolean;
  apply: () => Pick<UserProfile, "verifyStatus" | "verifyExpireAt">;
}[] = [
  { key: "-1", short: "未完成", active: (u) => u?.verifyStatus === -1, apply: () => ({ verifyStatus: -1, verifyExpireAt: null }) },
  { key: "0", short: "待审核", active: (u) => u?.verifyStatus === 0, apply: () => ({ verifyStatus: 0, verifyExpireAt: null }) },
  {
    key: "1",
    short: "通过",
    active: (u) => u?.verifyStatus === 1 && !isExpiringSoon(u.verifyExpireAt),
    apply: () => ({ verifyStatus: 1, verifyExpireAt: demoDateDaysFromNow(VERIFIED_DEMO_DAYS) }),
  },
  { key: "2", short: "拒绝", active: (u) => u?.verifyStatus === 2, apply: () => ({ verifyStatus: 2, verifyExpireAt: null }) },
  { key: "4", short: "资料不全", active: (u) => u?.verifyStatus === 4, apply: () => ({ verifyStatus: 4, verifyExpireAt: null }) },
  {
    key: "soon",
    short: "即将到期",
    active: (u) => u?.verifyStatus === 1 && isExpiringSoon(u.verifyExpireAt),
    apply: () => ({ verifyStatus: 1, verifyExpireAt: demoDateDaysFromNow(EXPIRING_SOON_DEMO_DAYS) }),
  },
  { key: "6", short: "已过期", active: (u) => u?.verifyStatus === 6, apply: () => ({ verifyStatus: 6, verifyExpireAt: null }) },
];

/** 开发者调试面板 — 右下角贴边绿色半胶囊，仅本次会话隐藏（刷新后重新展示） */
export default function DevPanel() {
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const accounts = useStore((s) => s.accounts);
  const upsertAccount = useStore((s) => s.upsertAccount);
  const setGuestMode = useStore((s) => s.setGuestMode);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const handleVerifyStatusItem = (item: (typeof VERIFY_STATUS_ITEMS)[number]) => {
    if (!user) return;
    setUser({ ...user, ...item.apply() });
    toast({ title: `已切换为「${item.short}」` });
  };

  const handleResetTodayCheckIn = () => {
    if (!user) return;
    const updated = {
      ...user,
      lastCheckInDate: null,
      signInStreak: 0,
      pendingSignInReward: 0,
      pendingSignInRewardDate: null,
      penaltyAppliedDates: [],
    };
    setUser(updated);
    localStorage.setItem("pke_mock_profile_" + user.pkeId, JSON.stringify(updated));
    toast({ title: "已重置签到状态（未签到 / 连续天数清零）" });
  };

  const handleLoginChange = async (on: boolean) => {
    if (!on) {
      if (user) upsertAccount(user);
      setUser(null);
      setGuestMode(true);
      localStorage.removeItem("pke_user_id");
      localStorage.removeItem("pke_avatar");
      localStorage.removeItem("pke_nickname");
      toast({ title: "已切换为未登录（游客）" });
      return;
    }

    setGuestMode(false);
    const restore = accounts[accounts.length - 1];
    if (restore) {
      setUser(restore);
      localStorage.setItem("pke_user_id", restore.pkeId);
      localStorage.setItem("pke_avatar", restore.avatar);
      localStorage.setItem("pke_nickname", restore.name);
    } else {
      const data = await registerUser("P客" + Math.floor(Math.random() * 10000));
      const avatar = BRAND.defaultAvatar(data.pkeId);
      const profile = { ...data.profile, avatar };
      setUser(profile);
      if (data.assets) setAssets(data.assets);
      localStorage.setItem("pke_user_id", data.pkeId);
      localStorage.setItem("pke_avatar", avatar);
    }
    toast({ title: "已切换为已登录" });
  };

  return (
    <div className="absolute right-0 bottom-24 z-[60] flex flex-col items-end">
      {open && (
        <div
          className="mb-2 mr-1 w-56 rounded-card bg-white shadow-warm p-4"
          style={{ border: `1px solid ${THEME.success}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-grid-label font-bold text-game-ink">开发者面板</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭"
              className="size-6 flex items-center justify-center rounded-button active:bg-game-bg-muted"
            >
              <X size={16} className="text-game-ink-tertiary" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-body text-game-ink-secondary">登录状态</span>
            <Switch
              checked={!!user}
              onCheckedChange={handleLoginChange}
              aria-label="登录状态"
            />
          </div>

          <div className="mb-3">
            <span className="text-body text-game-ink-secondary block mb-1.5">实名认证状态</span>
            <div className="flex flex-wrap gap-1">
              {VERIFY_STATUS_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  disabled={!user}
                  onClick={() => handleVerifyStatusItem(item)}
                  className={`h-6 px-1.5 rounded-button text-[10px] font-bold disabled:opacity-40 ${
                    item.active(user)
                      ? "bg-game-primary text-white"
                      : "bg-game-bg-muted text-game-ink-secondary"
                  }`}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetTodayCheckIn}
            disabled={!user}
            className="w-full mb-3 h-8 rounded-button text-caption font-bold text-game-primary bg-game-primary-soft active:opacity-70 disabled:opacity-40"
          >
            重置签到状态（演示未签到态）
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setHidden(true);
            }}
            className="w-full text-caption text-game-ink-tertiary active:opacity-70"
          >
            隐藏面板（刷新后重新展示）
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="开发者面板"
        className="flex items-center gap-1 h-8 pl-3 pr-2.5 rounded-l-pill text-white active:opacity-90 transition-opacity"
        style={{
          background: THEME.success,
          boxShadow: "0 2px 4px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.25)",
        }}
      >
        <Wrench size={14} />
        <span className="text-caption font-bold">DEV</span>
      </button>
    </div>
  );
}
