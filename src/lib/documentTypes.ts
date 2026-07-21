import type { CountryCode } from "./phoneCountries";

export type DocumentType = "idcard" | "passport" | "license";

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  idcard: "身份证",
  passport: "护照",
  license: "驾驶证",
};

// 仅接受本地身份证件的国家/地区（如中国大陆）
const ID_CARD_ONLY: CountryCode[] = ["CN"];
// 同时接受本地身份证件与护照的国家/地区
const ID_CARD_ALSO: CountryCode[] = ["HK", "MO", "TW"];

/** 根据所选国家/地区返回可用的证件类型；未特别配置的国家/地区默认按“护照 + 驾驶证”核验 */
export function allowedDocumentTypes(country: CountryCode): DocumentType[] {
  if (ID_CARD_ONLY.includes(country)) return ["idcard"];
  if (ID_CARD_ALSO.includes(country)) return ["idcard", "passport"];
  return ["passport", "license"];
}
