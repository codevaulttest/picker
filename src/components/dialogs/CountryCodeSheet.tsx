import { useMemo, useState } from "react";
import { Search, Check, Globe, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import {
  COUNTRIES,
  searchCountries,
  type CountryCode,
} from "@/lib/phoneCountries";

interface Props {
  open: boolean;
  value: CountryCode;
  onSelect: (code: CountryCode) => void;
  onClose: () => void;
}

/** 国家/地区选择——独立全屏列表页（业内标准形态），支持搜索，而非下拉菜单 */
export default function CountryCodeSheet({ open, value, onSelect, onClose }: Props) {
  const isDark = useStore((s) => s.isDark);
  const lang = useStore((s) => s.lang);
  const zh = lang !== "en";
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => searchCountries(COUNTRIES, query), [query]);

  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const inkDis = isDark ? "text-game-ink-disabled-dark" : "text-game-ink-disabled";
  const rowPress = isDark ? "active:bg-game-bg-muted-dark" : "active:bg-game-bg-muted/80";
  const fieldSurface = isDark
    ? "bg-game-bg-muted-dark border-game-border-light-dark text-game-ink-dark"
    : "bg-game-bg-muted border-game-border-light text-game-ink";

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setQuery("");
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className={`h-[92vh] rounded-t-card gap-0 border-0 p-0 ${isDark ? "bg-game-bg-card-dark" : "bg-game-bg-card"}`}
      >
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className={`text-section-title ${ink}`}>
            {zh ? "选择国家/地区" : "Select country/region"}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-2 flex-shrink-0">
          <div className="relative">
            <Search
              size={16}
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${inkDis}`}
            />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={zh ? "搜索国家/地区或区号" : "Search country or code"}
              className={`w-full h-11 pl-9 pr-9 rounded-button border text-task-title outline-none transition-shadow focus:ring-[3px] focus:ring-game-focus-ring dark:focus:ring-game-focus-ring-dark focus:border-game-primary placeholder:text-game-ink-disabled dark:placeholder:text-game-ink-disabled-dark ${fieldSurface}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 ${inkDis}`}
                aria-label={zh ? "清除" : "Clear"}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filtered.length === 0 ? (
            <p className={`text-body text-center mt-10 ${inkSec}`}>
              {zh ? "未找到匹配的国家/地区" : "No matching country found"}
            </p>
          ) : (
            filtered.map((c) => {
              const active = c.code === value;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onSelect(c.code);
                    setQuery("");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-button text-left transition-colors ${rowPress}`}
                >
                  {c.Flag ? (
                    <c.Flag className="w-6 h-4 rounded-[2px] shrink-0" />
                  ) : (
                    <Globe size={16} className={`shrink-0 ${inkDis}`} />
                  )}
                  <span className={`flex-1 min-w-0 truncate text-grid-label ${ink}`}>
                    {zh ? c.name : c.nameEn}
                  </span>
                  <span className={`text-body ${inkSec}`}>+{c.dial}</span>
                  {active && (
                    <Check size={18} className="shrink-0" style={{ color: GAME.primary }} />
                  )}
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
