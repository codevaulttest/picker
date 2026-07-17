import { useState } from "react";
import { BadgeCheck, Copy, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/stores";
import { getLevel, GAME, BRAND } from "@/config/app.config";
import { resolveDisplayPkeId } from "@/lib/pke-id";
import EditProfileDialog from "@/components/dialogs/EditProfileDialog";

interface Props {
  avatar?: string;
  name: string;
  pkeId?: string;
  isRealName?: boolean;
  level: number;
  /** false while logged out — taps open the login flow instead of profile editing */
  loggedIn?: boolean;
  onAvatarClick: () => void;
  onAvatarChange?: (url: string) => void;
  onNameChange?: (name: string) => void;
}

export default function PageHeader({
  avatar,
  name,
  pkeId,
  isRealName,
  level,
  loggedIn = true,
  onAvatarClick,
  onAvatarChange,
  onNameChange,
}: Props) {
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const [editOpen, setEditOpen] = useState(false);

  const handleIdentityClick = () => {
    if (loggedIn) setEditOpen(true);
    else onAvatarClick();
  };

  const savedAvatar = localStorage.getItem("pke_avatar");
  const savedName = localStorage.getItem("pke_nickname");
  const isPlaceholderAvatar =
    !avatar ||
    avatar.includes("api.dicebear.com") ||
    avatar.includes("avataaars");
  const displayAvatar =
    savedAvatar || (!isPlaceholderAvatar ? avatar : null) || BRAND.defaultAvatar(pkeId || "guest");
  const displayName = loggedIn ? savedName?.trim() || name : lang === "en" ? "Not logged in" : lang === "zh-TW" ? "尚未登入" : "未登录";

  const displayPkeId = resolveDisplayPkeId(pkeId);

  const handleCopyId = () => {
    navigator.clipboard.writeText(displayPkeId);
    toast({
      title: lang === "en" ? "ID Copied" : lang === "zh-TW" ? "已複製ID" : "已复制ID",
      description: displayPkeId,
    });
  };

  const handleProfileSave = (payload: { name: string; avatar: string }) => {
    localStorage.setItem("pke_nickname", payload.name);
    localStorage.setItem("pke_avatar", payload.avatar);
    onNameChange?.(payload.name);
    onAvatarChange?.(payload.avatar);
  };

  const lvConfig = getLevel(level);

  const AVATAR_SIZE = 84;
  const zh = lang !== "en";
  const chevronClass = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const unverifiedColor = isDark ? GAME.inkDisabledDark : GAME.inkDisabled;

  return (
    <header className="relative px-3.5 pt-3.5 pb-3 transition-colors">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
        aria-hidden
      />
      <div className="relative z-10">
        {/* 头像 + 用户信息（含等级条，紧贴 ID 行） */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handleIdentityClick}
              className="active:scale-95 transition-transform block"
              aria-label={zh ? "编辑资料" : "Edit profile"}
            >
              <img
                src={displayAvatar}
                alt="avatar"
                className="rounded-pill object-cover shadow-sm"
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  border: `3px solid ${isDark ? GAME.primarySoftDark : GAME.onPrimary}`,
                }}
              />
            </button>
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1">
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={handleIdentityClick}
                  className="flex items-center gap-1.5 max-w-full text-left active:opacity-80 transition-opacity"
                >
                  <h2
                    className={`text-identity-name truncate ${
                      isDark ? "text-game-ink-dark" : "text-game-ink"
                    }`}
                  >
                    {displayName}
                  </h2>
                  {loggedIn && (
                    <BadgeCheck
                      size={20}
                      className="flex-shrink-0"
                      style={{
                        color: isRealName ? GAME.primary : unverifiedColor,
                      }}
                      fill={isRealName ? GAME.primary : "transparent"}
                      stroke={isRealName ? GAME.onPrimary : unverifiedColor}
                    />
                  )}
                </button>
                {loggedIn ? (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 mt-1.5"
                  >
                    <span
                      className={`text-caption tabular-nums ${
                        isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"
                      }`}
                    >
                      ID: {displayPkeId}
                    </span>
                    <Copy
                      size={12}
                      className={isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary"}
                      style={{ transform: "scaleX(-1)" }}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAvatarClick}
                    className="mt-1.5"
                  >
                    <span className="text-grid-label font-semibold text-game-primary-text">
                      {zh ? "点击登录" : "Tap to log in"}
                    </span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleIdentityClick}
                className="flex size-11 flex-shrink-0 items-center justify-center -mr-2 rounded-button active:bg-game-bg-muted/80 dark:active:bg-game-bg-muted-dark transition-colors"
                aria-label={zh ? "编辑资料" : "Edit profile"}
              >
                <ChevronRight size={18} className={chevronClass} />
              </button>
            </div>

            {/* 等级 pill — 紧贴 ID 行；primary-soft / primary-soft-dark 底 */}
            {loggedIn && (
              <div
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-pill"
                style={{
                  background: isDark ? GAME.primarySoftDark : GAME.primarySoft,
                  height: 28,
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
              >
                <span className="flex-shrink-0 text-game-primary-text">
                  <span className="text-caption">称号：</span>
                  <span className="text-hud-label">{lvConfig.cnName}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileDialog
        open={editOpen}
        name={displayName}
        avatar={displayAvatar}
        pkeId={pkeId}
        onClose={() => setEditOpen(false)}
        onSave={handleProfileSave}
      />
    </header>
  );
}
