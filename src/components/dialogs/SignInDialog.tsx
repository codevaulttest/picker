import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import FaceScanDialog from "@/components/dialogs/FaceScanDialog";
import { signIn } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { TEXT, GAME } from "@/config/app.config";

const CHECKIN_REMINDER_KEY = "pke_checkin_reminder";

interface Props {
  open: boolean;
  reward: number;
  onClose: () => void;
  onGoRealName: () => void;
}

export default function SignInDialog({ open, reward, onClose, onGoRealName }: Props) {
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);
  const isDark = useStore((s) => s.isDark);

  const [reminder, setReminder] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem(CHECKIN_REMINDER_KEY) === "1"
  );
  const [showFaceScan, setShowFaceScan] = useState(false);

  const handleReminderChange = (on: boolean) => {
    setReminder(on);
    localStorage.setItem(CHECKIN_REMINDER_KEY, on ? "1" : "0");
    toast({ title: on ? "已开启签到提醒" : "已关闭签到提醒" });
  };

  const signInMutation = useMutation({
    mutationFn: (vars: { pkeId: string }) => signIn(vars.pkeId),
    onSuccess: (data) => {
      if (data.profile) {
        setUser(data.profile);
        if (data.profile.assets) setAssets(data.profile.assets);
      }
      if (!data.alreadySigned) {
        const rewardStr = Number.isInteger(data.reward) ? String(data.reward) : data.reward.toFixed(1);
        toast({ title: TEXT.home.signInNow + "成功", description: `${rewardStr}P币将于明日发放` });
      }
      onClose();
    },
  });

  return (
    <>
    <Dialog open={open && !showFaceScan} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm border-0 rounded-2xl">
        <div className="text-center py-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? "bg-game-primary-soft-dark" : "bg-game-primary-soft"
            }`}
          >
            <CalendarCheck size={32} className="text-game-primary" strokeWidth={2} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>
            {TEXT.home.dailySignIn}
          </h3>
          {user?.isRealName ? (
            <div className="mb-4">
              <p className={`text-sm ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
                点击签到领取
              </p>
              <p className="text-hero-number text-game-primary-text tabular-nums mt-1">
                +{Number.isInteger(reward) ? reward : reward.toFixed(1)}
                <span className="text-sm font-normal"> P币</span>
              </p>
            </div>
          ) : (
            <p className={`text-sm mb-4 ${isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary"}`}>
              {TEXT.home.toRealNameTip}
            </p>
          )}
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 mb-4 ${
              isDark ? "bg-game-bg-muted-dark" : "bg-game-bg-muted"
            }`}
          >
            <span className={`text-body ${isDark ? "text-game-ink-dark" : "text-game-ink"}`}>
              每日提醒我签到
            </span>
            <Switch
              checked={reminder}
              onCheckedChange={handleReminderChange}
              aria-label="每日提醒我签到"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={onClose}>
              {TEXT.home.signInLater}
            </Button>
            {user?.isRealName ? (
              <Button
                className="flex-1 rounded-xl h-11 text-white"
                style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                onClick={() => setShowFaceScan(true)}
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? "..." : TEXT.home.signInNow}
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-xl h-11 text-white"
                style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                onClick={onGoRealName}
              >
                {TEXT.home.toRealName}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <FaceScanDialog
      open={showFaceScan}
      onClose={() => setShowFaceScan(false)}
      onComplete={() => {
        setShowFaceScan(false);
        if (user?.pkeId) signInMutation.mutate({ pkeId: user.pkeId });
      }}
    />
    </>
  );
}
