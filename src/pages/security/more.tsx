import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { GAME } from "@/config/app.config";

const VAULT_PAY_KEY = "pke_vault_auth_pay";

function rowPress(isDark: boolean) {
  return isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";
}

export default function SecurityMorePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const [showDelete, setShowDelete] = useState(false);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const dialogSurface = isDark ? "bg-game-bg-card-dark" : undefined;
  const outlineBtn = isDark
    ? "border-game-border-light-dark text-game-ink-dark hover:bg-game-bg-muted-dark"
    : "border-game-border-light text-game-ink bg-game-bg-card";

  const handleDeleteAccount = () => {
    setShowDelete(false);
    toast({ title: "账户已注销", description: "本地会话已清除" });
    localStorage.removeItem("pke_user_id");
    localStorage.removeItem("pke_avatar");
    localStorage.removeItem("pke_nickname");
    localStorage.removeItem(VAULT_PAY_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-full flex flex-col transition-colors">
      <header className="relative px-3.5 pt-3.5 pb-2">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={() => navigate("/security")}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1
            className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}
          >
            更多
          </h1>
        </div>
      </header>

      <section className="mx-3.5 mt-2.5 mb-4 pb-2 flex-shrink-0">
        <div className={`rounded-card overflow-hidden transition-colors ${softCard}`}>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className={`w-full flex items-center gap-3 px-4 text-left transition-colors min-h-14 ${rowPress(isDark)}`}
          >
            <div
              className="w-10 h-10 rounded-button flex items-center justify-center flex-shrink-0"
              style={{
                background: isDark ? GAME.errorSoftDark : GAME.errorSoft,
              }}
            >
              <UserX size={20} style={{ color: GAME.error }} />
            </div>
            <span className="flex-1 text-grid-label truncate" style={{ color: GAME.error }}>
              注销账户
            </span>
            <ChevronRight size={16} className={inkDis} />
          </button>
        </div>
      </section>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent showCloseButton={false} className={dialogSurface}>
          <DialogHeader>
            <DialogTitle>注销账户</DialogTitle>
            <DialogDescription>
              注销后所有数据将被清除，且不可恢复。确定继续？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className={`h-12 rounded-button text-section-title ${outlineBtn}`}
              onClick={() => setShowDelete(false)}
            >
              取消
            </Button>
            <Button
              className="h-12 rounded-button text-section-title border-0"
              style={{ background: GAME.error, color: GAME.onPrimary }}
              onClick={handleDeleteAccount}
            >
              确认注销
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
