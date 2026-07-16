import { useNavigate } from "react-router";
import { Card } from "@/components/ui/card";
import { CAS_APPS, THEME } from "@/config/app.config";

const iconMap: Record<string, string> = {
  cow: "/icons/cas-cow.png",
  rosewood: "/icons/cas-tree.png",
};

export default function CASPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <h1 className="text-base font-semibold flex-1">CAS应用中心</h1>
      </div>
      <div className="mx-4 mt-3 space-y-2 pb-6">
        {CAS_APPS.map((app) => (
          <Card key={app.key} className="p-4 rounded-2xl border-0 shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: app.iconBg }}>
                <img src={iconMap[app.key] || `/icons/cas-${app.key}.png`} alt={app.name} className="w-8 h-8 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <app.icon size={22} style={{ color: app.iconColor }} className="absolute" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: THEME.text }}>{app.name}</p>
                <p className="text-xs" style={{ color: THEME.textMuted }}>{app.desc}</p>
              </div>
              {app.comingSoon && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">即将上线</span>}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
