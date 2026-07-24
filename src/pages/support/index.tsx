import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { useStore } from "@/stores";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { GAME } from "@/config/app.config";

const MAX_PHOTOS = 4;

export default function SupportPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDark = useStore((s) => s.isDark);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const softCard = isDark
    ? "bg-game-bg-card-dark shadow-warm-dark"
    : "bg-game-bg-card shadow-warm";
  const ink = isDark ? "text-game-ink-dark" : "text-game-ink";
  const inkTer = isDark ? "text-game-ink-tertiary-dark" : "text-game-ink-tertiary";
  const inkSec = isDark ? "text-game-ink-secondary-dark" : "text-game-ink-secondary";

  const canSubmit = content.trim().length > 0 && !submitting;

  const handlePickPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (url) setPhotos((prev) => [...prev, url].slice(0, MAX_PHOTOS));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    // 占位：后端暂无反馈提交接口，本地模拟提交成功
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "反馈已提交", description: "我们会尽快处理，感谢你的反馈" });
      navigate(-1);
    }, 400);
  };

  return (
    <div className="min-h-full flex flex-col transition-colors">
      <header className="relative px-3.5 pt-3.5 pb-2">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? GAME.headerGlowDark : GAME.headerGlow }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center h-11">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="relative z-10 flex size-11 items-center justify-center -ml-2 rounded-button"
            aria-label="返回"
          >
            <ChevronLeft size={22} strokeWidth={2} className={ink} />
          </button>
          <h1
            className={`pointer-events-none absolute inset-x-0 text-center text-section-title ${ink}`}
          >
            联系客服
          </h1>
        </div>
      </header>

      <section className="mx-3.5 mt-2.5 flex-shrink-0">
        <div className={`p-4 rounded-card transition-colors ${softCard}`}>
          <p className={`text-grid-label mb-3 ${ink}`}>问题反馈</p>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请详细描述你遇到的问题，我们会尽快为你处理"
            className="min-h-32 resize-none text-body"
            maxLength={500}
          />
          <p className={`text-caption text-right mt-1 ${inkSec}`}>{content.length}/500</p>

          <p className={`text-grid-label mt-4 mb-3 ${ink}`}>上传截图（选填）</p>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-button overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-pill flex items-center justify-center bg-black/60"
                  aria-label="移除图片"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-button flex flex-col items-center justify-center gap-1 border border-dashed"
                style={{ borderColor: isDark ? GAME.dividerDark : GAME.divider }}
              >
                <ImagePlus size={18} className={inkTer} />
                <span className={`text-caption ${inkSec}`}>
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePickPhotos}
          />
        </div>
      </section>

      <section className="mx-3.5 mt-4 flex-shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-12 rounded-button text-section-title border-0 transition-opacity disabled:opacity-40"
          style={{ background: GAME.primary, color: GAME.onPrimary }}
        >
          {submitting ? "提交中…" : "提交反馈"}
        </button>
      </section>
    </div>
  );
}
