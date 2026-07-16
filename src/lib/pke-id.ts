/** 规范化为 11 位纯数字 P客 ID */
export function toElevenDigitId(raw?: string | null): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length >= 11) return digits.slice(-11);
  return digits.padStart(11, "0");
}

const DISPLAY_ID_KEY = "pke_display_id";

/**
 * 首页 / 我的共用展示 ID：
 * user.pkeId → localStorage pke_user_id → 会话内稳定兜底（避免各页各自 random）
 */
export function resolveDisplayPkeId(pkeId?: string | null): string {
  const fromProp = toElevenDigitId(pkeId);
  if (fromProp) return fromProp;

  const fromStorage = toElevenDigitId(
    typeof localStorage !== "undefined" ? localStorage.getItem("pke_user_id") : null
  );
  if (fromStorage) return fromStorage;

  if (typeof sessionStorage !== "undefined") {
    const existing = toElevenDigitId(sessionStorage.getItem(DISPLAY_ID_KEY));
    if (existing) return existing;
    const generated = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("");
    sessionStorage.setItem(DISPLAY_ID_KEY, generated);
    return generated;
  }

  return "00000000000";
}
