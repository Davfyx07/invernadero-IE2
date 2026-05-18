export default function KpiCard({ title, value, change, positive, gradient, border, iconBg, iconColor, iconSvg, delay }) {
  const changeCls =
    positive === true
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : positive === false
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-cenit-100 text-cenit-600 dark:bg-cenit-800 dark:text-cenit-300";

  return (
    <div
      className={[
        "animate-fade-in-up rounded-2xl border p-6 shadow-sm hover:shadow-md transition cursor-default",
        gradient,
        border,
      ].join(" ")}
      style={{ animationDelay: `${delay * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={[
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBg,
            iconColor,
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        {change != null && (
          <span className={["text-xs font-semibold px-2 py-1 rounded-lg", changeCls].join(" ")}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-cenit-800 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-cenit-500 dark:text-cenit-300">{title}</p>
    </div>
  );
}
