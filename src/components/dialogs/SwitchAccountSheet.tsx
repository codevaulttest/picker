import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/useI18n";
import { BRAND, GAME } from "@/config/app.config";
import type { UserProfile } from "@/types";

function rowPress(isDark: boolean) {
  return isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SwitchAccountSheet({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const accounts = useStore((s) => s.accounts);
  const upsertAccount = useStore((s) => s.upsertAccount);
  const removeAccount = useStore((s) => s.removeAccount);

  const [removeTarget, setRemoveTarget] = useState<UserProfile | null>(null);

  // Make sure the currently active profile always shows up in the list.
  useEffect(() => {
    if (open && user?.pkeId) upsertAccount(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.pkeId]);

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";

  const applyActive = (account: UserProfile) => {
    setUser(account);
    localStorage.setItem("pke_user_id", account.pkeId);
    localStorage.setItem("pke_avatar", account.avatar);
    localStorage.setItem("pke_nickname", account.name);
  };

  const handleSwitch = (account: UserProfile) => {
    if (account.pkeId === user?.pkeId) return;
    applyActive(account);
    toast({ title: t.settings.switchedTo.replace("{name}", account.name) });
    onOpenChange(false);
  };

  const handleAddAccount = () => {
    onOpenChange(false);
    navigate("/login");
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    removeAccount(removeTarget.pkeId);
    toast({ title: t.settings.accountRemoved, variant: "destructive" });
    setRemoveTarget(null);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={`rounded-t-card gap-0 border-0 p-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
        >
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className={`text-section-title ${ink}`}>
              {t.settings.switchAccount}
            </SheetTitle>
          </SheetHeader>

          <div className="px-2 pb-2 max-h-[50vh] overflow-y-auto">
            {accounts.map((account) => {
              const active = account.pkeId === user?.pkeId;
              return (
                <div
                  key={account.pkeId}
                  className="w-full flex items-center gap-1 px-1 py-0.5 rounded-button"
                >
                  <button
                    type="button"
                    onClick={() => handleSwitch(account)}
                    className={`flex-1 min-w-0 flex items-center gap-3 px-2 py-2.5 rounded-button text-left transition-colors ${rowPress(isDark)}`}
                  >
                    <img
                      src={account.avatar || BRAND.defaultAvatar(account.pkeId)}
                      alt=""
                      className="w-10 h-10 rounded-pill object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-grid-label truncate ${ink}`}>{account.name}</p>
                      <p className={`text-body truncate mt-0.5 ${inkSec}`}>ID: {account.pkeId}</p>
                    </div>
                  </button>
                  {active ? (
                    <Check size={18} style={{ color: GAME.primary }} className="flex-shrink-0 mr-2" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(account)}
                      className="flex-shrink-0 p-2 mr-1 rounded-button"
                      aria-label={t.settings.removeAccount}
                    >
                      <Trash2 size={16} style={{ color: GAME.error }} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-2 pb-6">
            <button
              type="button"
              onClick={handleAddAccount}
              className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-button text-left transition-colors ${rowPress(isDark)}`}
            >
              <div
                className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
                style={{ background: isDark ? GAME.bgMutedDark : GAME.bgMuted }}
              >
                <Plus size={20} style={{ color: GAME.inkSecondary }} />
              </div>
              <span className={`text-grid-label ${ink}`}>{t.settings.addAccount}</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!removeTarget} onOpenChange={(v) => !v && setRemoveTarget(null)}>
        <AlertDialogContent
          className={`rounded-card border-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className={ink}>{t.settings.removeAccount}</AlertDialogTitle>
            <AlertDialogDescription className={inkSec}>
              {t.settings.removeAccountDesc.replace("{name}", removeTarget?.name || "")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-button border-0 sm:flex-initial" onClick={() => setRemoveTarget(null)}>
              {t.settings.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-button border-0 sm:flex-initial"
              style={{ background: GAME.error, color: GAME.onPrimary }}
              onClick={confirmRemove}
            >
              {t.settings.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
