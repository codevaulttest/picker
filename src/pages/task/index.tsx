import { useState } from "react";
import { Search, ChevronRight, HelpCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getTaskServices } from "@/lib/mockBackend";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { THEME, TASK_CATEGORIES, getLevel } from "@/config/app.config";
import { useI18n } from "@/hooks/useI18n";

/** 服务分类详情说明 */
const SERVICE_DETAILS: Record<string, { desc: string; priceRange: string; unit: string }> = {
  clean: { desc: "专业家政保洁服务，包括日常清洁、深度保洁、开荒保洁等", priceRange: "50-150", unit: "小时" },
  massage: { desc: "上门按摩推拿服务，包括中式推拿、精油 SPA、足疗等", priceRange: "100-300", unit: "小时" },
  repair: { desc: "家电维修服务，包括空调、冰箱、洗衣机、电视等", priceRange: "80-200", unit: "次" },
  move: { desc: "搬家拉货服务，包括小型搬家、长途搬家、公司搬迁等", priceRange: "200-500", unit: "次" },
  ac: { desc: "空调清洗保养服务，包括挂机、柜机、中央空调清洗", priceRange: "80-150", unit: "次" },
  nanny: { desc: "月嫂保姆服务，包括育儿嫂、月嫂、住家保姆等", priceRange: "200-500", unit: "天" },
  laundry: { desc: "衣物洗护服务，包括干洗、湿洗、奢侈品护理等", priceRange: "30-100", unit: "件" },
  pet: { desc: "宠物护理服务，包括宠物洗澡、美容、寄养、遛宠等", priceRange: "50-200", unit: "次" },
  delivery: { desc: "跑腿配送服务，包括同城配送、代买代办、文件速递等", priceRange: "20-100", unit: "次" },
  car: { desc: "汽车服务，包括上门洗车、保养、代驾、年检代办等", priceRange: "50-300", unit: "次" },
};

export default function TaskPage() {
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const user = useStore((s) => s.user);
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [selService, setSelService] = useState<string | null>(null);
  const [showTds, setShowTds] = useState(false);
  const [showPostTask, setShowPostTask] = useState(false);
  const [showForeman, setShowForeman] = useState(false);
  const [showForemanTip, setShowForemanTip] = useState(false);
  const [postTab, setPostTab] = useState<"post" | "complete">("post");
  const [taskService, setTaskService] = useState("clean");
  const [priceHour, setPriceHour] = useState("100");
  const [priceTime, setPriceTime] = useState("200");
  const [discHour, setDiscHour] = useState("90");
  const [discTime, setDiscTime] = useState("180");

  const { data: services = [] } = useQuery({
    queryKey: ["task", "services", search],
    queryFn: () => getTaskServices(search || undefined),
  });

  const lv = user?.level || 1;
  const lvConfig = getLevel(lv);
  const foremanRate = Math.min(2, 1 + (lv - 2) * 0.1);
  const displayName = user?.name || user?.realName || "";

  const bgMain = isDark ? "#0F172A" : THEME.bg;
  const cardBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white/80 border-white/50";
  const textMain = isDark ? "text-slate-200" : "";
  const textMuted = isDark ? "text-slate-500" : "";
  const textSecondary = isDark ? "text-slate-400" : "";

  return (
    <div className="min-h-screen pb-6 transition-colors" style={{ background: bgMain }}>
      {/* 搜索栏 */}
      <div className={`px-4 pt-4 pb-4 border-b transition-colors ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white/80 border-slate-100"}`} style={{ backdropFilter: "blur(12px)" }}>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input type="text" placeholder={t.task.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full h-11 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${isDark ? "bg-slate-700 text-white placeholder:text-slate-500 border-slate-600" : ""}`} style={{ background: isDark ? "#334155" : "#F1F5F9", color: isDark ? "#fff" : THEME.text }} />
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 mt-4">
        <div className="p-5 rounded-3xl text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C, #C850C0)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)" }} />
          <p className="text-xl font-bold relative z-10">{t.task.bannerTitle}</p>
          <p className="text-sm opacity-80 mt-1 relative z-10">{t.task.bannerSub}</p>
        </div>
      </div>

      {/* TDS任务入口 */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => setShowTds(true)}
          className={`w-full ${cardBg} p-4 rounded-2xl shadow-sm border flex items-center justify-between active:scale-[0.98] transition-transform`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #3B82F6)" }}>
              <span className="text-lg">📝</span>
            </div>
            <div className="text-left">
              <p className={`text-base font-bold ${textMain}`}>{t.task.tdsEntry}</p>
              <p className={`text-xs mt-0.5 ${textMuted}`}>{t.task.tdsSub}</p>
            </div>
          </div>
          <ChevronRight size={18} className={isDark ? "text-slate-600" : "text-slate-300"} />
        </button>
      </div>

      {/* 服务分类 - 新图标 */}
      <div className="mx-4 mt-4">
        <div className={`${cardBg} p-4 rounded-2xl shadow-sm border transition-colors`} style={{ backdropFilter: "blur(12px)" }}>
          <div className="grid grid-cols-5 gap-3">
            {TASK_CATEGORIES.map((cat) => (
              <button key={cat.key} onClick={() => setSelService(cat.key)} className="flex flex-col items-center gap-2 py-1 active:scale-95 transition-transform">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" draggable={false} />
                </div>
                <span className={`text-xs font-bold ${textSecondary}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 热门服务 */}
      <div className="px-4 mt-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-base font-bold ${textMain}`}>{t.task.hotServices}</h3>
          <button className={`text-sm font-medium ${textMuted}`} style={{ color: THEME.primary }}>{t.task.viewMore}</button>
        </div>
        <div className="space-y-3">
          {services.map((svc) => (
            <Card key={svc.id} className={`p-3 rounded-2xl border-0 shadow-sm flex gap-3 active:scale-[0.98] transition-transform cursor-pointer ${isDark ? "bg-slate-800" : ""}`}
              onClick={() => { setSelService(svc.categoryId ? TASK_CATEGORIES[svc.categoryId - 1]?.key || "clean" : "clean"); }}>
              <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={`/icons/svc-${svc.categoryId ? TASK_CATEGORIES[svc.categoryId - 1]?.key || "clean" : "clean"}.png`} alt={svc.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate ${textMain}`}>{svc.name}</h4>
                <p className={`text-xs truncate mt-0.5 ${textMuted}`}>{svc.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black" style={{ color: "#F97316" }}>{svc.price}<span className={`text-[10px] font-normal ${textMuted}`}>BV/{svc.unit}</span></span>
                  <Button size="sm" className="h-7 px-4 rounded-full text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>{t.task.book}</Button>
                </div>
              </div>
            </Card>
          ))}
          {services.length === 0 && (
            <>
              {/* 默认展示 */}
              {TASK_CATEGORIES.slice(0, 4).map((cat) => (
                <Card key={cat.key} className={`p-3 rounded-2xl border-0 shadow-sm flex gap-3 active:scale-[0.98] transition-transform cursor-pointer ${isDark ? "bg-slate-800" : ""}`}
                  onClick={() => setSelService(cat.key)}>
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${textMain}`}>{cat.name}{lang === "en" ? " Service" : "服务"}</h4>
                    <p className={`text-xs truncate mt-0.5 ${textMuted}`}>{SERVICE_DETAILS[cat.key]?.desc.slice(0, 20) || cat.name}...</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black" style={{ color: "#F97316" }}>{SERVICE_DETAILS[cat.key]?.priceRange || "100"}<span className={`text-[10px] font-normal ${textMuted}`}>BV/{SERVICE_DETAILS[cat.key]?.unit || "次"}</span></span>
                      <Button size="sm" className="h-7 px-4 rounded-full text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>{t.task.book}</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ═════════════════════ 弹窗 ═════════════════════ */}

      {/* 服务详情弹窗 */}
      <Dialog open={!!selService && !showTds && !showPostTask && !showForeman && !showForemanTip} onOpenChange={(o) => !o && setSelService(null)}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          {selService && (
            <>
              <DialogHeader>
                <DialogTitle className={`flex items-center gap-2 ${textMain}`}>
                  <img src={`/icons/svc-${selService}.png`} alt="" className="w-8 h-8 rounded-lg" />
                  {TASK_CATEGORIES.find(c => c.key === selService)?.name}{lang === "en" ? " Service" : "服务"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{SERVICE_DETAILS[selService]?.desc || ""}</p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${textSecondary}`}>{lang === "en" ? "Standard Price" : "标准价格"}</span>
                    <span className="text-sm font-black" style={{ color: THEME.primary }}>{SERVICE_DETAILS[selService]?.priceRange || "100"} BV/{SERVICE_DETAILS[selService]?.unit || "次"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${textSecondary}`}>{lang === "en" ? "Discount Price" : "优惠价格"}</span>
                    <span className="text-sm font-black text-green-500">{(parseInt(SERVICE_DETAILS[selService]?.priceRange.split("-")[0] || "100") * 0.9).toFixed(0)} BV/{SERVICE_DETAILS[selService]?.unit || "次"}</span>
                  </div>
                </div>
                <p className={`text-xs flex items-start gap-1 ${textMuted}`}><Info size={13} className="flex-shrink-0 mt-0.5" />{t.task.platformFee}</p>
                <div className="flex gap-3">
                  <Button variant="outline" className={`flex-1 rounded-xl h-11 font-bold ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}`} onClick={() => setSelService(null)}>{lang === "en" ? "Close" : "关闭"}</Button>
                  <Button className="flex-1 rounded-xl h-11 text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => { setSelService(null); setShowTds(true); setPostTab("complete"); }}>{lang === "en" ? "Accept Task" : "接单"}</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* TDS入口弹窗 */}
      <Dialog open={showTds} onOpenChange={setShowTds}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>{t.task.tdsEntry}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {/* 发起任务 / 完成任务 */}
            <div className={`flex rounded-xl p-1 ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
              <button onClick={() => setPostTab("post")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${postTab === "post" ? (isDark ? "bg-slate-600 text-white shadow" : "bg-white text-slate-800 shadow-sm") : (isDark ? "text-slate-400" : "text-slate-500")}`}>{t.task.postTask}</button>
              <button onClick={() => setPostTab("complete")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${postTab === "complete" ? (isDark ? "bg-slate-600 text-white shadow" : "bg-white text-slate-800 shadow-sm") : (isDark ? "text-slate-400" : "text-slate-500")}`}>{t.task.completeTask}</button>
            </div>

            {postTab === "post" ? (
              <div className="space-y-3">
                <p className={`text-xs ${textMuted}`}>{lang === "en" ? "Choose a service to post" : "选择要发起的服务类型"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {TASK_CATEGORIES.map((cat) => (
                    <button key={cat.key} onClick={() => { setTaskService(cat.key); setShowPostTask(true); setShowTds(false); }}
                      className={`p-3 rounded-xl border text-left active:scale-95 transition-transform ${isDark ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <div className="flex items-center gap-2">
                        <img src={cat.icon} alt="" className="w-7 h-7 rounded-lg" />
                        <span className={`text-sm font-bold ${textMain}`}>{cat.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className={`text-xs ${textMuted}`}>{lang === "en" ? "Available tasks near you" : "附近可接的任务"}</p>
                {TASK_CATEGORIES.slice(0, 4).map((cat) => (
                  <div key={cat.key} className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? "border-slate-700 bg-slate-700/30" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center gap-2">
                      <img src={cat.icon} alt="" className="w-8 h-8 rounded-lg" />
                      <div>
                        <p className={`text-sm font-bold ${textMain}`}>{cat.name}{lang === "en" ? " Task" : "任务"}</p>
                        <p className={`text-xs ${textMuted}`}>2km · {SERVICE_DETAILS[cat.key]?.priceRange}BV</p>
                      </div>
                    </div>
                    <Button size="sm" className="rounded-full text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>{lang === "en" ? "Accept" : "接单"}</Button>
                  </div>
                ))}
              </div>
            )}

            {/* 成为工头 */}
            <div className={`p-4 rounded-xl border ${isDark ? "border-amber-700/50 bg-amber-900/20" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-bold ${isDark ? "text-amber-300" : "text-amber-700"}`}>{t.task.foreman}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-amber-400/70" : "text-amber-600"}`}>{t.task.foremanDesc}</p>
                </div>
                <Button size="sm" className="rounded-xl text-xs text-white font-bold" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
                  onClick={() => { setShowTds(false); setShowForeman(true); }}>
                  {lang === "en" ? "Apply" : "申请"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 发起任务弹窗 */}
      <Dialog open={showPostTask} onOpenChange={setShowPostTask}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl max-h-[85vh] overflow-y-auto ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>{lang === "en" ? "Post Task" : "发起任务"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {/* 已选服务 */}
            <div className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <img src={`/icons/svc-${taskService}.png`} alt="" className="w-10 h-10 rounded-xl" />
              <div>
                <p className={`text-sm font-bold ${textMain}`}>{TASK_CATEGORIES.find(c => c.key === taskService)?.name}</p>
                <p className={`text-xs ${textMuted}`}>{SERVICE_DETAILS[taskService]?.desc.slice(0, 20)}...</p>
              </div>
            </div>

            {/* 首次发起提示 */}
            {!user?.isRealName && (
              <div className={`p-3 rounded-xl text-xs ${isDark ? "bg-blue-900/30 text-blue-300 border border-blue-800" : "bg-blue-50 text-blue-700"}`}>
                <p className="font-bold mb-1">{lang === "en" ? "First-time posting requires identity verification" : "首次发起任务需提交个人信息"}</p>
                <p>{lang === "en" ? "You can quickly use your verified P-ke account info" : "可快捷使用已实名的P客账号身份信息"}</p>
              </div>
            )}

            {/* 定价 */}
            <div>
              <label className={`text-sm font-bold mb-2 block ${textMain}`}>{lang === "en" ? "Pricing" : "定价"}</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs mb-1 block ${textMuted}`}>{lang === "en" ? "Standard (BV/hr)" : "标准价(BV/小时)"}</label>
                  <input type="number" value={priceHour} onChange={(e) => setPriceHour(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm font-bold outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${textMuted}`}>{lang === "en" ? "Standard (BV/time)" : "标准价(BV/次)"}</label>
                  <input type="number" value={priceTime} onChange={(e) => setPriceTime(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm font-bold outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200"}`} />
                </div>
                <div>
                  <label className={`text-xs mb-1 block text-green-500`}>{lang === "en" ? "Discount (BV/hr)" : "优惠价(BV/小时)"}</label>
                  <input type="number" value={discHour} onChange={(e) => setDiscHour(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm font-bold outline-none text-green-600 ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"}`} />
                </div>
                <div>
                  <label className={`text-xs mb-1 block text-green-500`}>{lang === "en" ? "Discount (BV/time)" : "优惠价(BV/次)"}</label>
                  <input type="number" value={discTime} onChange={(e) => setDiscTime(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm font-bold outline-none text-green-600 ${isDark ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"}`} />
                </div>
              </div>
            </div>

            {/* 平台提示 */}
            <div className={`p-3 rounded-xl flex items-start gap-2 ${isDark ? "bg-orange-900/30 border border-orange-800" : "bg-orange-50"}`}>
              <Info size={14} className={`flex-shrink-0 mt-0.5 ${isDark ? "text-orange-400" : "text-orange-500"}`} />
              <p className={`text-xs leading-relaxed ${isDark ? "text-orange-300" : "text-orange-700"}`}>{t.task.platformFee}</p>
            </div>

            <Button className="w-full h-12 rounded-xl text-white text-base font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => { setShowPostTask(false); toast({ title: lang === "en" ? "Task posted!" : "任务已发起！" }); }}>
              {lang === "en" ? "Post Task" : "确认发起"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 成为工头弹窗 */}
      <Dialog open={showForeman} onOpenChange={setShowForeman}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>{t.task.foreman}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {/* 工头身份说明入口 */}
            <button onClick={() => setShowForemanTip(true)} className={`text-xs flex items-center gap-1 ${isDark ? "text-blue-400" : "text-blue-500"}`}>
              <HelpCircle size={13} />{lang === "en" ? "Foreman Identity Guide" : "工头身份说明"}
            </button>

            {/* 用户信息展示 */}
            <div className={`space-y-3 p-4 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>{t.task.yourLevel}</span>
                <span style={{ color: lvConfig.color }}>
                  <span className="text-xs">称号：</span>
                  <span className="text-sm font-bold">{lvConfig.cnName}</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>{t.task.yourName}</span>
                <span className={`text-sm font-bold ${textMain}`}>{displayName || (lang === "en" ? "Not set" : "未设置")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>{t.task.yourIdCard}</span>
                <span className={`text-sm font-mono ${textMain}`}>{(user as any)?.idCard ? (user as any).idCard.toString().slice(0, 4) + "****" + (user as any).idCard.toString().slice(-4) : (lang === "en" ? "Not verified" : "未实名")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>{t.task.balance}</span>
                <span className="text-sm font-black" style={{ color: THEME.primary }}>{Number((user as any)?.cv || 0).toLocaleString()} CV</span>
              </div>
              <div className="border-t border-dashed" style={{ borderColor: isDark ? "#475569" : "#CBD5E1" }} />
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${textMain}`}>{t.task.payment}</span>
                <span className="text-lg font-black" style={{ color: "#F59E0B" }}>3,000 CV</span>
              </div>
            </div>

            {/* 收益预估 */}
            <div className={`p-3 rounded-xl ${isDark ? "bg-amber-900/30 border border-amber-800" : "bg-amber-50"}`}>
              <p className={`text-xs ${isDark ? "text-amber-400" : "text-amber-700"}`}>{lang === "en" ? "Your commission rate" : "您的佣金比例"}: <span className="font-black">{foremanRate.toFixed(1)}%</span></p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className={`flex-1 rounded-xl h-11 font-bold ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : ""}`} onClick={() => setShowForeman(false)}>{t.donor.cancel}</Button>
              <Button className="flex-1 rounded-xl h-11 text-white font-bold" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }} onClick={() => { setShowForeman(false); toast({ title: lang === "en" ? "Foreman application submitted!" : "工头申请已提交！" }); }}>
                {lang === "en" ? "Pay 3000CV" : "支付3000CV开通"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 工头身份说明弹窗 */}
      <Dialog open={showForemanTip} onOpenChange={setShowForemanTip}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>{lang === "en" ? "Foreman Guide" : "工头身份说明"}</DialogTitle></DialogHeader>
          <div className={`space-y-3 py-2 text-sm leading-relaxed ${textSecondary}`}>
            <p>{t.task.foremanRule}</p>
            <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
              <p className={`font-bold mb-2 ${textMain}`}>{lang === "en" ? "Rate Table" : "佣金比例表"}</p>
              {[
                { lv: 2, name: "贫农", rate: "1.0%" },
                { lv: 3, name: "富农", rate: "1.1%" },
                { lv: 4, name: "队长", rate: "1.2%" },
                { lv: 5, name: "村长", rate: "1.3%" },
                { lv: 6, name: "乡长", rate: "1.4%" },
                { lv: 7, name: "镇长", rate: "1.5%" },
                { lv: 8, name: "县令", rate: "1.6%" },
                { lv: 9, name: "知府", rate: "1.7%" },
                { lv: 10, name: "巡抚", rate: "1.8%" },
                { lv: 11, name: "太守", rate: "1.9%" },
                { lv: 12, name: "丞相", rate: "2.0%" },
              ].map((r) => (
                <div key={r.lv} className="flex justify-between items-center py-1">
                  <span>LV.{r.lv} {r.name}</span>
                  <span className="font-bold" style={{ color: THEME.primary }}>{r.rate}</span>
                </div>
              ))}
            </div>
            <p className={`text-xs ${textMuted}`}>{lang === "en" ? "* Commission is paid from the platform's 10% reserve pool" : "* 佣金从平台10%沉淀池中拨比发放"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
