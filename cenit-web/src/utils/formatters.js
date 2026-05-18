export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function enumBadge(label, colors = {}) {
  return colors[label] || "bg-cenit-100 text-cenit-700 dark:bg-cenit-800 dark:text-cenit-300";
}

export function boolBadge(val) {
  return val
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
}
