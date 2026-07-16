import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { clockInStepCount } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { CLOCK_IN_CONFIG, THEME } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

export default function StepCountPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [steps, setSteps] = useState(5200);
  const cfg = CLOCK_IN_CONFIG.stepCount;

  const clockMut = useMutation({
    mutationFn: (vars: { userId: number; steps: number }) => clockInStepCount(vars.steps),
    onSuccess: (d) => { toast({ title: "打卡成功", description: `获得${d.reward}PB` }); },
  });

  const pct = Math.min(100, (steps / cfg.minSteps) * 100);
  const ok = steps >= cfg.minSteps;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">{cfg.label}</h1>
      </div>
      <div className="flex flex-col items-center pt-8 px-4">
        <Card className="w-full p-6 rounded-3xl border-0 shadow-lg text-center">
          <img src="/icons/step-count.png" alt="" className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-lg font-semibold" style={{ color: THEME.text }}>{cfg.slogan}</h2>
        </Card>
        <Card className="w-full p-5 rounded-2xl border-0 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: THEME.textSecondary }}>今日步数</span>
            <span className="text-2xl font-bold" style={{ color: ok ? THEME.emerald : THEME.text }}>{steps.toLocaleString()}</span>
          </div>
          <Progress value={pct} className="h-3 rounded-full" />
          <div className="flex justify-between mt-1"><span className="text-xs" style={{ color: THEME.textMuted }}>0</span><span className="text-xs" style={{ color: THEME.textMuted }}>目标: {cfg.minSteps.toLocaleString()}</span></div>
        </Card>
        <div className="w-full mt-4">
          <input type="range" min="0" max="20000" step="100" value={steps} onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-xs" style={{ color: THEME.textMuted }}><span>0</span><span>10,000</span><span>20,000</span></div>
        </div>
        <Button className="mt-6 w-full h-14 rounded-2xl text-base font-bold shadow-lg"
          style={ok ? { background: "linear-gradient(90deg, #10B981, #14B8A6)", color: "#fff" } : { background: "#E2E8F0", color: "#94A3B8" }}
          onClick={() => user && clockMut.mutate({ userId: user.userId, steps })}
          disabled={!ok || clockMut.isPending}>
          {clockMut.isPending ? "..." : ok ? "完成打卡 · 获得5PB" : "步数未达标"}
        </Button>
        <Card className="w-full p-4 rounded-2xl border-0 shadow-sm mt-4 mb-6">
          <h3 className="text-sm font-medium mb-2" style={{ color: THEME.text }}>打卡规则</h3>
          <p className="text-xs" style={{ color: THEME.textSecondary }}>· 设备记录行走5000步即可打卡</p><p className="text-xs" style={{ color: THEME.textSecondary }}>· 打卡成功奖励 5PB</p>
        </Card>
      </div>
    </div>
  );
}
