import { IdCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores";
import { GAME } from "@/config/app.config";
import { findCountry, type CountryCode } from "@/lib/phoneCountries";
import { DOCUMENT_LABELS, type DocumentType } from "@/lib/documentTypes";

interface Props {
  open: boolean;
  region?: CountryCode | null;
  documentType?: DocumentType | null;
  maskedName?: string | null;
  expireAt?: string | null;
  onClose: () => void;
}

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

export default function RealNameInfoDialog({
  open,
  region,
  documentType,
  maskedName,
  expireAt,
  onClose,
}: Props) {
  const isDark = useStore((s) => s.isDark);
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const country = region ? findCountry(region) : undefined;
  const Flag = country?.Flag;

  const rows = [
    { label: "认证状态", value: "已认证", tone: GAME.success },
    { label: "真实姓名", value: maskedName || "—" },
    { label: "证件类型", value: documentType ? DOCUMENT_LABELS[documentType] : "—" },
    {
      label: "认证地区",
      value: country ? (
        <span className="inline-flex items-center gap-1.5">
          {Flag && <Flag className="w-4 h-3 rounded-[2px]" />}
          {country.name}
        </span>
      ) : (
        "—"
      ),
    },
    { label: "认证到期时间", value: expireAt || "—" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined} showCloseButton>
        <DialogHeader>
          <div
            className="w-16 h-16 rounded-button flex items-center justify-center mx-auto"
            style={{ background: isDark ? GAME.successSoftDark : GAME.successSoft }}
          >
            <IdCard size={32} style={{ color: GAME.success }} />
          </div>
          <DialogTitle>实名认证信息</DialogTitle>
        </DialogHeader>

        <div className="w-full space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className={`text-body ${inkSec}`}>{row.label}</span>
              <span
                className={`text-grid-label font-medium ${ink}`}
                style={row.tone ? { color: row.tone } : undefined}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="h-12 rounded-button text-section-title border-0"
            style={CTA_STYLE}
            onClick={onClose}
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
