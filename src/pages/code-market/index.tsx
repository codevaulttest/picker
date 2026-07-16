import { useState } from "react";
import { useNavigate } from "react-router";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { THEME } from "@/config/app.config";

const items = [
  { id: 1, type: "认证码", name: "认证码x5", seller: "P客888", price: 2500, asset: "CV", qty: 5 },
  { id: 2, type: "升级码", name: "Lv.3升级码", seller: "P客666", price: 3000, asset: "BV", qty: 1 },
  { id: 3, type: "认证码", name: "认证码x10", seller: "P客999", price: 5000, asset: "UV", qty: 10 },
  { id: 4, type: "P币", name: "P币x100", seller: "P客777", price: 500, asset: "BV", qty: 100 },
  { id: 5, type: "升级码", name: "Lv.5升级码", seller: "P客555", price: 50000, asset: "BV", qty: 1 },
];
const filters = ["全部", "认证码", "升级码", "P币"];

export default function CodeMarketPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState("全部");
  const filtered = filter === "全部" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <h1 className="text-base font-semibold flex-1">BV互换</h1>
      </div>
      <div className="mx-4 mt-3"><div className="p-3 rounded-xl flex items-center gap-2" style={{ background: "#F0FDF4" }}>
        <TrendingUp size={16} style={{ color: THEME.success }} /><p className="text-xs" style={{ color: "#15803D" }}>撮合拍卖系统 - 互换您需要的BV</p>
      </div></div>
      <div className="flex mx-4 mt-3 bg-white rounded-xl p-1 overflow-x-auto">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap ${filter === f ? "text-white" : "text-slate-500"}`} style={filter === f ? { background: THEME.success } : {}}>{f}</button>
        ))}
      </div>
      <div className="mx-4 mt-3 space-y-2 pb-6">
        {filtered.map((it) => (
          <Card key={it.id} className="p-4 rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 rounded" style={{ background: THEME.primaryLighter, color: THEME.primary }}>{it.type}</span>
                  <span className="text-sm font-medium" style={{ color: THEME.text }}>{it.name}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>卖家: {it.seller}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: THEME.orange }}>{it.price.toLocaleString()} {it.asset}</p>
                <Button size="sm" className="h-7 px-3 rounded-full text-xs text-white" style={{ background: THEME.success }}
                  onClick={() => toast({ title: "下单成功", description: `您购买了${it.name}` })}>拍下</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
