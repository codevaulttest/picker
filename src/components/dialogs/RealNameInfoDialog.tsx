import { IdCard, Hourglass, XCircle, AlertTriangle } from "lucide-react";
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
import { isExpiringSoon, VERIFY_STATUS_META, type VerifyStatus } from "@/lib/realName";

interface Props {
  open: boolean;
  status?: VerifyStatus;
  region?: CountryCode | null;
  documentType?: DocumentType | null;
  maskedName?: string | null;
  expireAt?: string | null;
  onClose: () => void;
  onReverify?: () => void;
  onRenew?: () => void;
}

const CTA_STYLE = {
  background: `linear-gradient(135deg, ${GAME.primary}, ${GAME.primaryLight})`,
  boxShadow: `0 2px 0 ${GAME.primaryPressed}`,
  color: GAME.onPrimary,
} as const;

const STATUS_COPY: Partial<Record<VerifyStatus, { message: string; cta?: string }>> = {
  0: { message: "认证审核中，请耐心等待" },
  2: { message: "很抱歉，您的实名认证未通过审核，请检查证件信息后重新提交", cta: "重新提交" },
  4: { message: "您提交的资料不完整，请补充证件照片或人脸核验信息后重新提交", cta: "去完善资料" },
};

export default function RealNameInfoDialog({
  open,
  status,
  region,
  documentType,
  maskedName,
  expireAt,
  onClose,
  onReverify,
  onRenew,
}: Props) {
  const isDark = useStore((s) => s.isDark);
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";
  const country = region ? findCountry(region) : undefined;
  const Flag = country?.Flag;
  const meta = status !== undefined ? VERIFY_STATUS_META[status] : undefined;
  const isDetail = meta?.action === "detail" || meta?.action === "expired";
  const expiringSoon = status === 1 && isExpiringSoon(expireAt);

  const iconBg = expiringSoon
    ? isDark ? GAME.warningSoftDark : GAME.warningSoft
    : isDark ? GAME.successSoftDark : GAME.successSoft;
  const iconColor = expiringSoon ? GAME.warning : GAME.success;
  const Icon = IdCard;
  const StatusIcon =
    meta?.action === "pending" ? Hourglass : meta?.action === "rejected" ? XCircle : AlertTriangle;
  const statusIconBg =
    meta?.action === "rejected"
      ? isDark ? GAME.errorSoftDark : GAME.errorSoft
      : isDark ? GAME.warningSoftDark : GAME.warningSoft;
  const statusIconColor = meta?.action === "rejected" ? GAME.error : GAME.warning;

  const rows = [
    {
      label: "认证状态",
      value: expiringSoon ? "即将到期" : meta?.label ?? "已认证",
      tone: expiringSoon || meta?.tone === "warning" ? GAME.warning : GAME.success,
    },
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

  const statusCopy = status !== undefined ? STATUS_COPY[status] : undefined;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={isDark ? "bg-game-bg-card-dark" : undefined} showCloseButton>
        <DialogHeader>
          <div
            className="w-16 h-16 rounded-button flex items-center justify-center mx-auto"
            style={{ background: isDetail ? iconBg : statusIconBg }}
          >
            {isDetail ? (
              <Icon size={32} style={{ color: iconColor }} />
            ) : (
              <StatusIcon size={32} style={{ color: statusIconColor }} />
            )}
          </div>
          <DialogTitle>实名认证信息</DialogTitle>
        </DialogHeader>

        {isDetail ? (
          <div className="w-full space-y-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className={`text-grid-label font-normal ${inkSec}`}>{row.label}</span>
                <span
                  className={`text-grid-label font-medium ${ink}`}
                  style={row.tone ? { color: row.tone } : undefined}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-body text-center ${inkSec}`}>{statusCopy?.message}</p>
        )}

        <DialogFooter className="flex-row gap-2">
          {statusCopy?.cta || meta?.action === "expired" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-button text-section-title"
                onClick={onClose}
              >
                关闭
              </Button>
              <Button
                type="button"
                className="h-12 flex-1 rounded-button text-section-title border-0"
                style={CTA_STYLE}
                onClick={onReverify}
              >
                {statusCopy?.cta ?? "重新认证"}
              </Button>
            </>
          ) : meta?.action === "detail" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-button text-section-title"
                onClick={onClose}
              >
                关闭
              </Button>
              <Button
                type="button"
                className="h-12 flex-1 rounded-button text-section-title border-0"
                style={CTA_STYLE}
                onClick={onRenew}
              >
                续费
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="h-12 w-full rounded-button text-section-title border-0"
              style={CTA_STYLE}
              onClick={onClose}
            >
              关闭
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
