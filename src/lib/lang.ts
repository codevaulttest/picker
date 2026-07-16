/** App language codes — keep short codes aligned with existing `zh` / `en`. */
export type AppLang = "zh" | "zh-TW" | "en";

export const APP_LANGS: readonly AppLang[] = ["zh", "zh-TW", "en"] as const;

/** Native display names for the language picker / current-lang label. */
export const LANG_LABELS: Record<AppLang, string> = {
  zh: "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
};

export function isAppLang(v: unknown): v is AppLang {
  return v === "zh" || v === "zh-TW" || v === "en";
}

/** Any Chinese locale (简体 or 繁體). */
export function isChinese(lang: AppLang): boolean {
  return lang !== "en";
}
