import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/components/layout/AppLayout";
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

export default function App() {
  return (
    <>
      <Toaster />
      <AppLayout>
        <Routes>
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
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AppLayout>
    </>
  );
}
