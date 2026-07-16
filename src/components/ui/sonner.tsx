import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { GAME } from "@/config/app.config"

/**
 * System Toast — DESIGN.md
 * Soft card：bg-card + border-light + shadow-warm + rounded.card
 * 正文 ink；状态色只作用在 leading icon（success 绿 / error / warning / info）
 */
const toastSurface =
  "!bg-game-bg-card !text-game-ink !border-game-border-light shadow-warm rounded-card " +
  "px-4 py-3 gap-2 w-[calc(100%-28px)] max-w-md"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      offset={16}
      gap={8}
      visibleToasts={2}
      duration={2000}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-game-success" />,
        info: <InfoIcon className="size-4 text-game-info" />,
        warning: <TriangleAlertIcon className="size-4 text-game-warning" />,
        error: <OctagonXIcon className="size-4 text-game-error" />,
        loading: <Loader2Icon className="size-4 animate-spin text-game-ink-tertiary" />,
      }}
      style={
        {
          // Sonner CSS vars need resolved colors (not raw HSL components)
          "--normal-bg": GAME.bgCard,
          "--normal-text": GAME.ink,
          "--normal-border": GAME.borderLight,
          "--success-bg": GAME.bgCard,
          "--success-text": GAME.ink,
          "--success-border": GAME.borderLight,
          "--error-bg": GAME.bgCard,
          "--error-text": GAME.ink,
          "--error-border": GAME.borderLight,
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: toastSurface,
          title: "text-body font-medium text-game-ink",
          description: "text-caption text-game-ink-secondary mt-1",
          success: toastSurface,
          error: toastSurface,
          warning: toastSurface,
          info: toastSurface,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
