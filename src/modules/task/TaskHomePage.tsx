/**
 * 任务首页 - 模仿"到位APP"首页
 * 小程序返回按钮 + 定位切换 + 搜索 + Banner + 分类 + 特惠 + 推荐
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ChevronRight, Star, Flame, Sparkles, X, ChevronLeft, ChevronLeft as ArrowBack } from "lucide-react";
import { useStore } from "@/stores";
import { TASK_CATEGORIES } from "@/config/app.config";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const SERVICE_DETAILS: Record<string, { desc: string; price: string; unit: string; features: string[] }> = {
  clean: { desc: "专业家政保洁，包括日常清洁、深度保洁、开荒保洁", price: "50", unit: "小时", features: ["日常保洁", "深度保洁", "开荒保洁"] },
  massage: { desc: "上门按摩推拿，中式推拿、精油 SPA、足疗", price: "100", unit: "小时", features: ["中式推拿", "精油 SPA", "足疗按摩"] },
  repair: { desc: "家电维修，空调、冰箱、洗衣机、电视等", price: "80", unit: "次", features: ["空调维修", "冰箱维修", "洗衣机维修"] },
  move: { desc: "搬家拉货，小型搬家、长途搬家、公司搬迁", price: "200", unit: "次", features: ["小型搬家", "长途搬家", "公司搬迁"] },
  ac: { desc: "空调清洗保养，挂机、柜机、中央空调", price: "80", unit: "次", features: ["挂机清洗", "柜机清洗", "中央空调"] },
  nanny: { desc: "月嫂保姆，育儿嫂、月嫂、住家保姆", price: "200", unit: "天", features: ["月嫂", "育儿嫂", "住家保姆"] },
  laundry: { desc: "衣物洗护，干洗、湿洗、奢侈品护理", price: "30", unit: "件", features: ["干洗", "湿洗", "奢侈品护理"] },
  pet: { desc: "宠物护理，洗澡、美容、寄养、遛宠", price: "50", unit: "次", features: ["宠物洗澡", "宠物美容", "宠物寄养"] },
  delivery: { desc: "跑腿配送，同城配送、代买代办", price: "20", unit: "次", features: ["同城配送", "代买代办", "文件速递"] },
  car: { desc: "汽车服务，上门洗车、保养、代驾", price: "50", unit: "次", features: ["上门洗车", "汽车保养", "代驾"] },
};



export default function TaskHomePage() {
  const navigate = useNavigate();
  const isDark = useStore((s) => s.isDark);
  const [search, setSearch] = useState("");
  const [selService, setSelService] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPath, setLocationPath] = useState<string[]>(["亚洲", "中国", "北京市", "北京市"]);
  const [pickStep, setPickStep] = useState(0); // 0:大洲 1:国家 2:省 3:市 4:区
  const [worldData, setWorldData] = useState<typeof import("./world-locations").WORLD_LOCATIONS | null>(null);

  const bgCard = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100";
  const textMain = isDark ? "text-slate-200" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const textMuted = isDark ? "text-slate-500" : "text-gray-400";

  const service = selService ? SERVICE_DETAILS[selService] : null;

  return (
    <div className="pb-2">
      {/* 顶部栏：定位 + 小程序返回按钮 */}
      <div className={`sticky top-0 z-40 px-4 pt-3 pb-3 ${isDark ? "bg-slate-900/95" : "bg-gray-50/95"}`} style={{ backdropFilter: "blur(10px)" }}>
        {/* 第一行：定位 + 小程序返回按钮 */}
        <div className="flex items-center justify-between mb-2">
          {/* 左侧：定位（可点击切换） */}
          <button
            onClick={() => { setPickStep(0); setShowLocationPicker(true); if (!worldData) import("./world-locations").then(m => setWorldData(m.WORLD_LOCATIONS)); }}
            className="flex items-center gap-1 active:scale-95 transition-transform"
          >
            <MapPin size={14} className="text-orange-500" />
            <span className={`text-xs font-bold ${textSecondary}`}>{locationPath[locationPath.length - 1]}</span>
            <ChevronRight size={12} className={textMuted} />
          </button>

          {/* 右侧：小程序风格返回按钮（胶囊） */}
          <div className={`flex items-center h-7 rounded-full overflow-hidden border ${isDark ? "border-slate-600 bg-slate-800/80" : "border-gray-300 bg-white/80"}`}>
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center justify-center w-10 h-full active:bg-gray-100 dark:active:bg-slate-700 transition-colors ${isDark ? "border-r border-slate-600" : "border-r border-gray-300"}`}
            >
              <ChevronLeft size={16} className={textSecondary} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-10 h-full active:bg-gray-100 dark:active:bg-slate-700 transition-colors"
            >
              <X size={14} className={textSecondary} />
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className={`relative flex items-center h-10 rounded-full px-4 ${isDark ? "bg-slate-800" : "bg-white"} shadow-sm`}>
          <Search size={16} className={textMuted} />
          <input
            type="text"
            placeholder="搜索服务、技师、商家"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 ml-2 text-sm bg-transparent outline-none ${textMain}`}
            style={{ color: isDark ? "#E2E8F0" : "#111827" }}
          />
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 mt-2">
        <div className="relative p-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
          <div className="relative z-10">
            <p className="text-white text-lg font-black">新人专享优惠</p>
            <p className="text-white/80 text-xs mt-1">首单立减50BV · 30分钟极速上门</p>
            <Button size="sm" className="mt-3 h-7 px-4 rounded-full bg-white text-orange-500 text-xs font-bold hover:bg-white/90">
              立即领取
            </Button>
          </div>
        </div>
      </div>

      {/* 服务分类 - 大图标 2行5列 */}
      <div className={`mx-4 mt-3 p-3 rounded-2xl border ${bgCard}`}>
        <div className="grid grid-cols-5 gap-y-3 gap-x-1">
          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelService(cat.key)}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" draggable={false} />
              </div>
              <span className={`text-[10px] font-medium ${textSecondary}`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 限时特惠 */}
      <div className="mx-4 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" />
            <span className={`text-sm font-bold ${textMain}`}>限时特惠</span>
          </div>
          <button className={`text-xs ${textMuted} flex items-center`}>
            更多 <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { name: "日常保洁2小时", price: "88", orig: "120", img: "/icons/image1.png" },
            { name: "全身推拿60分钟", price: "128", orig: "200", img: "/icons/image4.png" },
            { name: "空调深度清洗", price: "68", orig: "100", img: "/icons/image7.png" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setShowBooking(true)}
              className={`flex-shrink-0 w-36 rounded-xl border overflow-hidden ${bgCard} active:scale-95 transition-transform text-left`}
            >
              <div className="h-20 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className={`text-xs font-bold truncate ${textMain}`}>{item.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-black text-orange-500">{item.price}BV</span>
                  <span className={`text-[10px] line-through ${textMuted}`}>{item.orig}BV</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 推荐服务 */}
      <div className="mx-4 mt-3 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500" />
            <span className={`text-sm font-bold ${textMain}`}>推荐服务</span>
          </div>
        </div>
        <div className="space-y-2">
          {TASK_CATEGORIES.slice(0, 5).map((cat) => {
            const detail = SERVICE_DETAILS[cat.key];
            return (
              <button
                key={cat.key}
                onClick={() => setSelService(cat.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border ${bgCard} active:scale-[0.98] transition-transform text-left`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${textMain}`}>{cat.name}服务</p>
                  <p className={`text-xs truncate mt-0.5 ${textMuted}`}>{detail?.desc}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium">4.9</span>
                    </div>
                    <span className={`text-xs ${textMuted}`}>月销1000+</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-orange-500">{detail?.price}BV</p>
                  <p className={`text-[10px] ${textMuted}`}>/{detail?.unit}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 全球定位选择弹窗 - 大洲→国家→省→市→区 */}
      <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl max-h-[80vh] overflow-hidden flex flex-col ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader>
            <DialogTitle className={textMain}>
              {pickStep === 0 ? "选择大洲" : pickStep === 1 ? "选择国家" : pickStep === 2 ? "选择省/州" : pickStep === 3 ? "选择城市" : "选择县/区"}
            </DialogTitle>
          </DialogHeader>

          {/* 面包屑路径 */}
          {locationPath.length > 0 && (
            <div className={`flex items-center gap-1 px-1 py-2 overflow-x-auto scrollbar-hide text-[10px] ${textMuted}`}>
              {locationPath.map((p, i) => (
                <span key={i} className="flex items-center flex-shrink-0">
                  {i > 0 && <ChevronRight size={10} className="mx-0.5" />}
                  <button
                    onClick={() => setPickStep(i)}
                    className={`font-medium ${i === pickStep ? (isDark ? "text-orange-400" : "text-orange-500") : ""}`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 选择列表 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
            {pickStep === 0 && (
              <div className="grid grid-cols-1 gap-1">
                {(worldData || []).map((continent) => (
                  <button
                    key={continent.name}
                    onClick={() => { setLocationPath([continent.name]); setPickStep(1); }}
                    className={`flex items-center justify-between p-3 rounded-xl text-left active:scale-[0.98] transition-transform ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                  >
                    <span className={`text-sm font-bold ${textMain}`}>{continent.name}</span>
                    <span className={`text-xs ${textMuted}`}>{continent.countries.length}个国家/地区</span>
                  </button>
                ))}
              </div>
            )}

            {pickStep === 1 && (
              <div className="grid grid-cols-1 gap-1">
                {(worldData || []).find(c => c.name === locationPath[0])?.countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => { setLocationPath(prev => [...prev.slice(0, 1), country.name]); setPickStep(2); }}
                    className={`flex items-center justify-between p-3 rounded-xl text-left active:scale-[0.98] transition-transform ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                  >
                    <span className={`text-sm font-bold ${textMain}`}>{country.name}</span>
                    <span className={`text-xs ${textMuted}`}>{(country.provinces?.length || 0)}个省/州</span>
                  </button>
                ))}
              </div>
            )}

            {pickStep === 2 && (
              <div className="grid grid-cols-1 gap-1">
                {(() => {
                  const country = (worldData || []).find(c => c.name === locationPath[0])?.countries.find(c => c.name === locationPath[1]);
                  if (!country?.provinces || country.provinces.length === 0) {
                    return (
                      <button
                        onClick={() => setShowLocationPicker(false)}
                        className="p-4 rounded-xl text-center text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/30"
                      >
                        确认: {locationPath.join(" > ")}
                      </button>
                    );
                  }
                  return country.provinces.map((province) => (
                    <button
                      key={province.name}
                      onClick={() => { setLocationPath(prev => [...prev.slice(0, 2), province.name]); setPickStep(3); }}
                      className={`flex items-center justify-between p-3 rounded-xl text-left active:scale-[0.98] transition-transform ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                    >
                      <span className={`text-sm font-bold ${textMain}`}>{province.name}</span>
                      <span className={`text-xs ${textMuted}`}>{(province.cities?.length || 0)}个城市</span>
                    </button>
                  ));
                })()}
              </div>
            )}

            {pickStep === 3 && (
              <div className="grid grid-cols-1 gap-1">
                {(() => {
                  const country = (worldData || []).find(c => c.name === locationPath[0])?.countries.find(c => c.name === locationPath[1]);
                  const province = country?.provinces?.find(p => p.name === locationPath[2]);
                  if (!province?.cities || province.cities.length === 0) {
                    return (
                      <button
                        onClick={() => setShowLocationPicker(false)}
                        className="p-4 rounded-xl text-center text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-30"
                      >
                        确认: {locationPath.join(" > ")}
                      </button>
                    );
                  }
                  return province.cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => { setLocationPath(prev => [...prev.slice(0, 3), city.name]); setPickStep(4); }}
                      className={`flex items-center justify-between p-3 rounded-xl text-left active:scale-[0.98] transition-transform ${isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}
                    >
                      <span className={`text-sm font-bold ${textMain}`}>{city.name}</span>
                      <span className={`text-xs ${textMuted}`}>{(city.districts?.length || 0)}个县/区</span>
                    </button>
                  ));
                })()}
              </div>
            )}

            {pickStep === 4 && (
              <div className="grid grid-cols-1 gap-1">
                {(() => {
                  const country = (worldData || []).find(c => c.name === locationPath[0])?.countries.find(c => c.name === locationPath[1]);
                  const province = country?.provinces?.find(p => p.name === locationPath[2]);
                  const city = province?.cities?.find(c => c.name === locationPath[3]);
                  if (!city?.districts || city.districts.length === 0) {
                    return (
                      <button
                        onClick={() => setShowLocationPicker(false)}
                        className="p-4 rounded-xl text-center text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/30"
                      >
                        确认: {locationPath.join(" > ")}
                      </button>
                    );
                  }
                  return city.districts.map((district) => (
                    <button
                      key={district.name}
                      onClick={() => { setLocationPath(prev => [...prev.slice(0, 4), district.name]); setShowLocationPicker(false); }}
                      className={`p-3 rounded-xl text-left text-sm font-bold active:scale-[0.98] transition-transform ${isDark ? "hover:bg-slate-700/50 text-slate-200" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      {district.name}
                    </button>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* 底部操作 */}
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? "#334155" : "#E5E7EB" }}>
            {pickStep > 0 && (
              <Button variant="outline" className={`flex-1 rounded-xl h-10 text-xs font-bold ${isDark ? "border-slate-600" : ""}`}
                onClick={() => setPickStep(pickStep - 1)}>
                <ArrowBack size={14} className="mr-1" /> 返回上一级
              </Button>
            )}
            <Button variant="outline" className={`flex-1 rounded-xl h-10 text-xs font-bold ${isDark ? "border-slate-600" : ""}`}
              onClick={() => setShowLocationPicker(false)}>
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 服务详情弹窗 */}
      <Dialog open={!!selService && !showBooking} onOpenChange={(o) => !o && setSelService(null)}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          {service && (
            <>
              <DialogHeader>
                <DialogTitle className={textMain}>
                  {TASK_CATEGORIES.find(c => c.key === selService)?.name}服务
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="h-32 rounded-xl overflow-hidden">
                  <img src={TASK_CATEGORIES.find(c => c.key === selService)?.icon} alt="" className="w-full h-full object-cover" />
                </div>
                <p className={`text-sm ${textSecondary}`}>{service.desc}</p>
                <div className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-gray-50"}`}>
                  <p className={`text-xs font-bold mb-2 ${textMain}`}>服务内容</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((f, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-slate-600 text-slate-300" : "bg-gray-200 text-gray-600"}`}>{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-orange-500">{service.price} BV</span>
                    <span className={`text-xs ml-1 ${textMuted}`}>/{service.unit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                </div>
                <p className={`text-xs ${textMuted}`}>结算时仅收到90%，10%为平台运营及销毁</p>
                <div className="flex gap-3">
                  <Button variant="outline" className={`flex-1 rounded-xl h-11 font-bold ${isDark ? "border-slate-600" : ""}`} onClick={() => setSelService(null)}>
                    关闭
                  </Button>
                  <Button className="flex-1 rounded-xl h-11 text-white font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => { setSelService(null); setShowBooking(true); }}>
                    立即预约
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 预约弹窗 */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className={`sm:max-w-sm border-0 rounded-2xl ${isDark ? "bg-slate-800 border-slate-700" : ""}`}>
          <DialogHeader><DialogTitle className={textMain}>预约服务</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={`text-sm font-bold mb-1 block ${textMain}`}>服务地址</label>
              <input type="text" defaultValue={locationPath.slice(2).join("")} className={`w-full h-10 px-3 rounded-lg border text-sm outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-200"}`} />
            </div>
            <div>
              <label className={`text-sm font-bold mb-1 block ${textMain}`}>预约时间</label>
              <div className="grid grid-cols-3 gap-2">
                {["今天", "明天", "后天"].map((d) => (
                  <button key={d} className={`py-2 rounded-lg text-xs font-bold border ${isDark ? "border-slate-600 text-slate-300" : "border-gray-200 text-gray-600"}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className={`text-sm font-bold mb-1 block ${textMain}`}>时长</label>
              <div className="grid grid-cols-4 gap-2">
                {["1小时", "2小时", "3小时", "4小时"].map((t) => (
                  <button key={t} className={`py-2 rounded-lg text-xs font-bold border ${isDark ? "border-slate-600 text-slate-300" : "border-gray-200 text-gray-600"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? "bg-amber-900/30 border border-amber-800" : "bg-amber-50"}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>预计支付</span>
                <span className="text-lg font-black text-orange-500">100 BV</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? "text-amber-400/70" : "text-amber-600"}`}>实际到账90BV（10%平台服务费）</p>
            </div>
            <Button className="w-full h-12 rounded-xl text-white text-base font-bold" style={{ background: "linear-gradient(135deg, #FF6B35, #FF4E8C)" }} onClick={() => setShowBooking(false)}>
              确认预约
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
