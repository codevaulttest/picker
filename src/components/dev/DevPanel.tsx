import { useState } from "react";
import { Wrench, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { THEME, BRAND } from "@/config/app.config";
import { registerUser } from "@/lib/mockBackend";

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

  const handleRealNameChange = (on: boolean) => {
    if (user) setUser({ ...user, isRealName: on });
    toast({ title: on ? "已切换为已实名" : "已切换为未实名" });
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

          <div className="flex items-center justify-between mb-3">
            <span className="text-body text-game-ink-secondary">实名认证状态</span>
            <Switch
              checked={!!user?.isRealName}
              onCheckedChange={handleRealNameChange}
              disabled={!user}
              aria-label="实名认证状态"
            />
          </div>

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
