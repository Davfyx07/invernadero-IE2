import { useState } from "react";

export default function DataTable({ columns, data, keyExtractor, renderRow, searchPlaceholder, filterOptions, loading }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filterOptions?.[0]?.value || "");

  const filtered = data.filter((row) => {
    const matchesSearch = query
      ? columns.some((c) => {
          const val  = c.accessor ? row[c.accessor] : "";
          return String(val).toLowerCase().includes(query.toLowerCase());
        })
      : true;
    const matchesFilter = filter && filter !== ""
      ? String(row[filterOptions[0].accessor]).toLowerCase() === filter.toLowerCase()
      : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-6 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-cenit-100 dark:bg-cenit-700 rounded-lg animate-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 p-6 shadow-sm">
      {(searchPlaceholder || filterOptions) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {searchPlaceholder && (
            <div className="flex items-center bg-cenit-50 dark:bg-cenit-900 rounded-xl px-3 py-2 border border-cenit-100 dark:border-cenit-700 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition">
              <svg className="w-4 h-4 text-cenit-300 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-transparent text-sm outline-none w-40 placeholder:text-cenit-300 dark:text-white"
              />
            </div>
          )}
          {filterOptions && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm rounded-xl border border-cenit-200 dark:border-cenit-700 bg-white dark:bg-cenit-900 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
            >
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-cenit-100 dark:border-cenit-700">
              {columns.map((c) => (
                <th key={c.key} className="pb-3 font-medium text-cenit-500 dark:text-cenit-300">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cenit-100 dark:divide-cenit-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-cenit-400">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-cenit-50/50 dark:hover:bg-cenit-700/50 transition">
                  {renderRow(row)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
