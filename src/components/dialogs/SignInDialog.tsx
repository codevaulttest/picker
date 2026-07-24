import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import FaceScanDialog from "@/components/dialogs/FaceScanDialog";
import { signIn } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { TEXT, GAME } from "@/config/app.config";
import signInGiftReward from "@/assets/illustrations/signin-gift-reward.webp";

const CHECKIN_REMINDER_KEY = "pke_checkin_reminder";

interface Props {
  open: boolean;
  reward: number;
  onClose: () => void;
  onGoRealName: () => void;
}

function formatReward(reward: number) {
  return Number.isInteger(reward) ? String(reward) : reward.toFixed(1);
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

  const isRealName = Boolean(user?.isRealName);
  const rewardLabel = formatReward(reward);

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
        const rewardStr = formatReward(data.reward);
        toast({ title: TEXT.home.signInNow + "成功", description: `${rewardStr}P币将于明日发放` });
      }
      onClose();
    },
  });

  return (
    <>
      <Dialog open={open && !showFaceScan} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-sm gap-0 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-56"
            style={{
              background: `linear-gradient(180deg, ${
                isDark ? GAME.primarySoftDark : GAME.primarySoft
              } 0%, transparent 100%)`,
            }}
          />
          <div className="relative flex flex-col items-center text-center pt-1 pb-1">
            <img
              src={signInGiftReward}
              alt=""
              width={238}
              height={223}
              draggable={false}
              className="-mt-1 mb-2 w-[238px] h-auto animate-in zoom-in-95 fade-in-0 object-contain select-none duration-300"
            />

            <DialogTitle className="mb-3 text-identity-name">{TEXT.home.dailySignIn}</DialogTitle>

            <div className="mb-3 w-full rounded-button bg-game-reward-gold-soft px-4 py-3 dark:bg-game-reward-gold-soft-dark">
              <p className="text-caption text-game-ink-secondary dark:text-game-ink-secondary-dark">
                {isRealName ? "今日可领" : "今日可领（认证后领取）"}
              </p>
              <p className="mt-1 text-hero-number text-game-primary-text tabular-nums">
                +{rewardLabel}
                <span className="ml-1 text-body text-game-ink dark:text-game-ink-dark">P币</span>
              </p>
            </div>

            <DialogDescription className="sr-only">
              {isRealName ? "点击签到领取今日奖励" : TEXT.home.toRealNameTip}
            </DialogDescription>

            <div className="mb-5 flex w-full items-center justify-between gap-3 px-0.5">
              <span className="text-caption text-game-ink-secondary dark:text-game-ink-secondary-dark">
                每日提醒我签到
              </span>
              <Switch
                checked={reminder}
                onCheckedChange={handleReminderChange}
                aria-label="每日提醒我签到"
              />
            </div>

            <DialogFooter className="w-full">
              {isRealName ? (
                <Button
                  className="h-12 rounded-button text-game-on-primary border-0"
                  style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                  onClick={() => setShowFaceScan(true)}
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? "..." : TEXT.home.signInNow}
                </Button>
              ) : (
                <Button
                  className="h-12 rounded-button text-game-on-primary border-0"
                  style={{ background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})` }}
                  onClick={onGoRealName}
                >
                  {TEXT.home.toRealName}
                </Button>
              )}
            </DialogFooter>
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
