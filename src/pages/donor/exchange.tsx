import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { exchangeAuthCode, exchangeUpgradeCode } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { AUTH_CODE_CONFIG, THEME, getLevel } from "@/config/app.config";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

const costs: Record<number, number> = { 2: 500, 3: 2500, 4: 10000, 5: 45000, 6: 65000, 7: 115000, 8: 215000, 9: 415000, 10: 815000, 11: 1615000, 12: 3215000 };

export default function BVExchangePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<"auth" | "upgrade">("auth");
  const [authCount, setAuthCount] = useState(1);
  const [upLevel, setUpLevel] = useState(2);

  const authMut = useMutation({
    mutationFn: (vars: { userId: number; count: number }) => exchangeAuthCode(vars.count),
    onSuccess: (d) => { toast({ title: "成功", description: `获得${d.totalCodes}个认证码` }); },
  });
  const upMut = useMutation({
    mutationFn: (vars: { userId: number; level: number }) => exchangeUpgradeCode(vars.level),
    onSuccess: (d) => { toast({ title: "成功", description: `获得${getLevel(d.level).cnName}升级码` }); },
  });

  const bonus = authCount >= AUTH_CODE_CONFIG.bulkThreshold ? Math.floor(authCount * AUTH_CODE_CONFIG.bulkBonus) : 0;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/donor")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">BV兑换专区</h1>
      </div>
      <div className="flex mx-4 mt-3 bg-white rounded-xl p-1">
        <button onClick={() => setTab("auth")} className={`flex-1 py-2 text-xs font-medium rounded-lg ${tab === "auth" ? "text-white" : "text-slate-500"}`} style={tab === "auth" ? { background: THEME.primary } : {}}>认证码</button>
        <button onClick={() => setTab("upgrade")} className={`flex-1 py-2 text-xs font-medium rounded-lg ${tab === "upgrade" ? "text-white" : "text-slate-500"}`} style={tab === "upgrade" ? { background: THEME.orange } : {}}>升级码</button>
      </div>
      {tab === "auth" ? (
        <div className="px-4 mt-4">
          <Card className="p-4 rounded-2xl border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><span className="text-sm font-medium">认证码兑换</span><span className="text-xs" style={{ color: THEME.textMuted }}>1000BV/个 · 10送3</span></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: THEME.textSecondary }}>兑换数量</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setAuthCount(Math.max(1, authCount - 1))} className="w-8 h-8 rounded-lg bg-slate-100 text-sm">-</button>
                <span className="w-8 text-center font-semibold">{authCount}</span>
                <button onClick={() => setAuthCount(authCount + 1)} className="w-8 h-8 rounded-lg bg-slate-100 text-sm">+</button>
              </div>
            </div>
            {bonus > 0 && <p className="text-xs text-green-600 mb-3">批发优惠: 赠送{bonus}个，共{authCount + bonus}个</p>}
            <div className="flex items-center justify-between text-sm mb-4"><span style={{ color: THEME.textSecondary }}>消耗BV</span><span className="font-bold" style={{ color: THEME.primary }}>{authCount * 1000}</span></div>
            <Button className="w-full h-11 rounded-xl text-white" style={{ background: THEME.primary }}
              onClick={() => user && authMut.mutate({ userId: user.userId, count: authCount })} disabled={authMut.isPending}>立即兑换</Button>
          </Card>
        </div>
      ) : (
        <div className="px-4 mt-4 space-y-2">
          {Object.entries(costs).map(([lv, c]) => {
            const l = Number(lv);
            return (
              <Card key={lv} className={`p-3 rounded-xl border-0 shadow-sm cursor-pointer ${upLevel === l ? "ring-2" : ""}`}
                style={upLevel === l ? { background: THEME.orangeLight } : {}}
                onClick={() => setUpLevel(l)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: THEME.orangeLight, color: THEME.orange }}>Lv.{l}</span>
                    <span className="text-sm" style={{ color: THEME.text }}>{getLevel(l).cnName}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: THEME.orange }}>{c.toLocaleString()} BV</span>
                </div>
              </Card>
            );
          })}
          <Button className="w-full h-11 rounded-xl text-white mt-3" style={{ background: THEME.orange }}
            onClick={() => user && upMut.mutate({ userId: user.userId, level: upLevel })} disabled={upMut.isPending}>
            {upMut.isPending ? "..." : `支付${costs[upLevel]?.toLocaleString()}BV兑换Lv.${upLevel}升级码`}
          </Button>
        </div>
      )}
    </div>
  );
}
