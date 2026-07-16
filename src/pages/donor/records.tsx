import { useNavigate } from "react-router";
import { HandCoins, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDonateOrders, getProxyOrders } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { THEME, TEXT, getLevel } from "@/config/app.config";
import { useState } from "react";
import backArrowIcon from "@/assets/svg/svg/custom/back-arrow.svg?url";

export default function DonateRecordsPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<"donate" | "proxy">("donate");

  const { data: dOrders = [] } = useQuery({
    queryKey: ["donor", "orders", user?.userId],
    queryFn: () => getDonateOrders(),
    enabled: !!user,
  });
  const { data: pOrders = [] } = useQuery({
    queryKey: ["donor", "proxyOrders", user?.userId],
    queryFn: () => getProxyOrders(),
    enabled: !!user,
  });

  const orders = tab === "donate" ? dOrders : pOrders;

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/donor")} className="p-1"><img src={backArrowIcon} alt="" width={20} height={20} /></button>
        <h1 className="text-base font-semibold flex-1">{tab === "donate" ? TEXT.donor.donateRecords : TEXT.donor.proxyRecords}</h1>
      </div>
      <div className="flex mx-4 mt-3 bg-white rounded-xl p-1">
        <button onClick={() => setTab("donate")} className={`flex-1 py-2 text-xs font-medium rounded-lg ${tab === "donate" ? "text-white" : "text-slate-500"}`} style={tab === "donate" ? { background: THEME.primary } : {}}><HandCoins size={12} className="inline mr-1" />{TEXT.donor.donateRecords}</button>
        <button onClick={() => setTab("proxy")} className={`flex-1 py-2 text-xs font-medium rounded-lg ${tab === "proxy" ? "text-white" : "text-slate-500"}`} style={tab === "proxy" ? { background: THEME.primary } : {}}><Users size={12} className="inline mr-1" />{TEXT.donor.proxyRecords}</button>
      </div>
      <div className="mx-4 mt-3 space-y-2 pb-6">
        {orders.map((o: any) => (
          <Card key={o.id} className="p-4 rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: THEME.primaryLighter, color: THEME.primary }}>Lv.{o.targetLevel}</span>
                  <span className="text-xs" style={{ color: THEME.textMuted }}>{getLevel(o.targetLevel).cnName}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>{new Date(o.createdAt).toLocaleString()}</p>
                {"toUserName" in o && <p className="text-xs" style={{ color: THEME.textMuted }}>代打赏给: {o.toUserName}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: THEME.text }}>{Number(o.payAmount).toLocaleString()} {o.payAsset}</p>
                <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "#F1F5F9" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, o.progress / 2)}%`, background: THEME.primary }} />
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: THEME.textMuted }}>进度 {o.progress}%</p>
              </div>
            </div>
          </Card>
        ))}
        {orders.length === 0 && <div className="text-center py-12 text-sm" style={{ color: THEME.textMuted }}>暂无记录</div>}
      </div>
    </div>
  );
}
