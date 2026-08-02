import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/language-provider";

export type Timeframe = "sekarang" | "prediksi";

export function TimeframeTabs({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-5 text-sm">
      <button
        onClick={() => onChange("sekarang")}
        className={cn(
          "cursor-pointer border-b-2 pb-0.5 font-medium transition-colors",
          value === "sekarang"
            ? "border-primary text-primary"
            : "border-transparent text-text-muted hover:text-text"
        )}
      >
        {t("common.now")}
      </button>
      <button
        onClick={() => onChange("prediksi")}
        className={cn(
          "cursor-pointer border-b-2 pb-0.5 font-medium transition-colors",
          value === "prediksi"
            ? "border-primary text-primary"
            : "border-transparent text-text-muted hover:text-text"
        )}
      >
        {t("common.predicted")}
      </button>
    </div>
  );
}
