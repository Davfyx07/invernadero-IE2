import { useI18n } from "../hooks/useI18n";

const FLAGS = {
  es: "🇪🇸",
  en: "🇬🇧",
  fr: "🇫🇷",
  it: "🇮🇹",
};

export default function LanguageSelector({ className = "" }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={["relative group", className].join(" ")}>
      <button
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition"
        aria-label={t("common.language")}
      >
        <span>{FLAGS[locale] || "🌐"}</span>
        <span className="uppercase">{locale}</span>
        <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-cenit-800 rounded-xl shadow-lg border border-cenit-100 dark:border-cenit-700 z-50 hidden group-hover:block">
        {Object.entries(FLAGS).map(([code, flag]) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={[
              "w-full flex items-center gap-2 px-3 py-2 text-sm first:rounded-t-xl last:rounded-b-xl transition",
              locale === code
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-cenit-700 dark:text-cenit-200 hover:bg-cenit-50 dark:hover:bg-cenit-700",
            ].join(" ")}
          >
            <span>{flag}</span>
            <span className="uppercase">{code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
