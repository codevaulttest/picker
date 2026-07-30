import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/stores";
import { getUserProfile } from "@/lib/mockBackend";
import { BRAND } from "@/config/app.config";
import SplashPage from "@/pages/splash";
import HomePage from "@/pages/home";
import AuthCodePage from "@/pages/auth-code";
import UpgradeCodePage from "@/pages/upgrade-code";
import DonorPage from "@/pages/donor";
import ProxyDonatePage from "@/pages/donor/proxy";
import BVExchangePage from "@/pages/donor/exchange";
import DonateRecordsPage from "@/pages/donor/records";
import EarlyRisePage from "@/pages/clock-in/early";
import StepCountPage from "@/pages/clock-in/step";
import WealthPage from "@/pages/wealth";
import SecurityPage from "@/pages/security";
import SecurityMorePage from "@/pages/security/more";
import MiniProgramPage from "@/pages/mini-program";
import CodeMarketPage from "@/pages/code-market";
import SettingsPage from "@/pages/settings";
import SettingsGeneralPage from "@/pages/settings/general";
import SupportPage from "@/pages/support";
import LoginPage from "@/pages/account-login";
import { TaskLayout } from "@/modules/task";

/** 单个会话内只展示一次开屏欢迎页；标签页关闭/新会话会再次出现 */
const SPLASH_SEEN_KEY = "pke_splash_seen";

/**
 * 已砍掉游客模式：除登录页外，未登录（本地无 pke_user_id）一律先跳登录页。
 * 顺带在这里统一把 user 从本地 pkeId 水合出来（不再依赖首页单独水合），
 * 避免直接刷新到 /settings 等其它受保护页面时 user 短暂为空、露出"未登录"UI。
 */
function RequireAuth() {
  const pkeId = localStorage.getItem("pke_user_id");
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const setAssets = useStore((s) => s.setAssets);

  const { data: profileData, isFetched } = useQuery({
    queryKey: ["user", "profile", pkeId],
    queryFn: () => getUserProfile(pkeId || ""),
    enabled: !!pkeId && !user,
  });

  useEffect(() => {
    if (!profileData) return;
    setUser({ ...profileData, avatar: profileData.avatar || BRAND.defaultAvatar(profileData.pkeId) } as any);
    if (profileData.assets) {
      const assets: Record<string, number> = {};
      for (const [k, v] of Object.entries(profileData.assets)) assets[k] = typeof v === "string" ? Number(v) : (v as number);
      setAssets(assets as any);
    }
  }, [profileData, setUser, setAssets]);

  if (!pkeId) return <Navigate to="/login" replace />;
  // pkeId 存在但读不到对应 profile（本地数据损坏/被清）：清掉失效会话，回登录页
  if (!user && isFetched && !profileData) {
    localStorage.removeItem("pke_user_id");
    localStorage.removeItem("pke_avatar");
    localStorage.removeItem("pke_nickname");
    return <Navigate to="/login" replace />;
  }
  if (!user) return null;
  return <Outlet />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem(SPLASH_SEEN_KEY) !== "1"
  );

  if (showSplash) {
    return (
      <SplashPage
        onDone={() => {
          sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <>
      <Toaster />
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth-code" element={<AuthCodePage />} />
            <Route path="/upgrade-code" element={<UpgradeCodePage />} />
            <Route path="/donor" element={<DonorPage />} />
            <Route path="/donor/proxy" element={<ProxyDonatePage />} />
            <Route path="/donor/exchange" element={<BVExchangePage />} />
            <Route path="/donor/records" element={<DonateRecordsPage />} />
            <Route path="/task/*" element={<TaskLayout />} />
            <Route path="/clock-in/early" element={<EarlyRisePage />} />
            <Route path="/clock-in/step" element={<StepCountPage />} />
            <Route path="/wealth" element={<WealthPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/security/more" element={<SecurityMorePage />} />
            <Route path="/mini-program" element={<MiniProgramPage />} />
            <Route path="/code-market" element={<CodeMarketPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/general" element={<SettingsGeneralPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>
        </Routes>
      </AppLayout>
    </>
  );
}
