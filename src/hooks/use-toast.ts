import { toast as sonnerToast } from "sonner";

/** Align with DESIGN.md System Toast variants */
type ToastVariant = "default" | "success" | "info" | "warning" | "destructive";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const DURATION: Record<ToastVariant, number> = {
  default: 2000,
  success: 2000,
  info: 2000,
  warning: 3000,
  destructive: 3000,
};

export function useToast() {
  const toast = (options: ToastOptions) => {
    const variant = options.variant ?? "success";
    const duration = options.duration ?? DURATION[variant];
    const opts = { description: options.description, duration };

    switch (variant) {
      case "destructive":
        sonnerToast.error(options.title, opts);
        break;
      case "warning":
        sonnerToast.warning(options.title, opts);
        break;
      case "info":
        sonnerToast.info(options.title, opts);
        break;
      case "default":
        sonnerToast(options.title, opts);
        break;
      case "success":
      default:
        sonnerToast.success(options.title, opts);
        break;
    }
  };
  return { toast };
}

export { sonnerToast as toast };
