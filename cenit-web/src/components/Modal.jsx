export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-cenit-800 rounded-2xl border border-cenit-100 dark:border-cenit-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cenit-100 dark:border-cenit-700">
            <h3 className="text-lg font-semibold text-cenit-800 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-cenit-50 dark:hover:bg-cenit-700 transition">
              <svg className="w-5 h-5 text-cenit-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-cenit-100 dark:border-cenit-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
