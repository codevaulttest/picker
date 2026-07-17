import { create } from "zustand";
import type { UserProfile, UserAssets, AuthCode } from "@/types";
import type { AppLang } from "@/lib/lang";

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUserLevel: (level: number) => void;

  // Assets
  assets: UserAssets | null;
  setAssets: (assets: UserAssets) => void;
  updateAsset: (key: keyof UserAssets, value: number) => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showSignIn: boolean;
  setShowSignIn: (show: boolean) => void;
  // 全屏覆盖类面板（如首页下拉小程序面板）打开时临时隐藏底部导航
  hideBottomNav: boolean;
  setHideBottomNav: (v: boolean) => void;

  // Auth codes
  authCodes: AuthCode[];
  setAuthCodes: (codes: AuthCode[]) => void;

  // Donor
  donorVersion: "ASIA" | "GLOBAL";
  setDonorVersion: (v: "ASIA" | "GLOBAL") => void;

  // Settings
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  lang: AppLang;
  setLang: (v: AppLang) => void;

  // Saved accounts (device-local, demo multi-account switcher)
  accounts: UserProfile[];
  upsertAccount: (account: UserProfile) => void;
  removeAccount: (pkeId: string) => void;

  // Guest mode — true once the user has explicitly logged out; prevents
  // auto-registering a throwaway guest profile until they log back in.
  guestMode: boolean;
  setGuestMode: (v: boolean) => void;
}

const ACCOUNTS_KEY = "pke_accounts";
const GUEST_MODE_KEY = "pke_guest_mode";

function loadAccounts(): UserProfile[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as UserProfile[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: UserProfile[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

const defaultAssets: UserAssets = {
  uv: 0, cv: 0, pb: 0, bv: 0, dos: 0,
  greenGem: 0, yellowGem: 0, redGem: 0,
  pkeBv: 0, pkePoint: 0,
  asiaPkeBv: 0, asiaPkePoint: 0,
  globalBv: 0, globalPkePoint: 0, shotPoint: 0,
};

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUserLevel: (level) => set((s) => s.user ? { user: { ...s.user, level } } : {}),

  assets: null,
  setAssets: (assets) => set({ assets }),
  updateAsset: (key, value) => set((s) => ({
    assets: s.assets ? { ...s.assets, [key]: value } : defaultAssets,
  })),

  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
  showSignIn: false,
  setShowSignIn: (show) => set({ showSignIn: show }),
  hideBottomNav: false,
  setHideBottomNav: (v) => set({ hideBottomNav: v }),

  authCodes: [],
  setAuthCodes: (codes) => set({ authCodes: codes }),

  donorVersion: "ASIA",
  setDonorVersion: (v) => set({ donorVersion: v }),

  isDark: false,
  setIsDark: (v) => set({ isDark: v }),
  lang: "zh",
  setLang: (v) => set({ lang: v }),

  accounts: loadAccounts(),
  upsertAccount: (account) => set((s) => {
    const idx = s.accounts.findIndex((a) => a.pkeId === account.pkeId);
    const accounts = idx >= 0
      ? s.accounts.map((a, i) => (i === idx ? account : a))
      : [...s.accounts, account];
    saveAccounts(accounts);
    return { accounts };
  }),
  removeAccount: (pkeId) => set((s) => {
    const accounts = s.accounts.filter((a) => a.pkeId !== pkeId);
    saveAccounts(accounts);
    return { accounts };
  }),

  guestMode: localStorage.getItem(GUEST_MODE_KEY) === "1",
  setGuestMode: (v) => {
    localStorage.setItem(GUEST_MODE_KEY, v ? "1" : "0");
    set({ guestMode: v });
  },
}));
