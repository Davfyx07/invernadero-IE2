import Modal from "./Modal";

export default function ConfirmDialog({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      footer={
        <>
          <button
            onClick={onCancel}
            className="rounded-xl border border-cenit-200 dark:border-cenit-600 bg-white dark:bg-cenit-700 px-5 py-2.5 text-sm font-medium text-cenit-600 dark:text-cenit-200 hover:bg-cenit-50 dark:hover:bg-cenit-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] ${confirmColor || "bg-red-600 hover:bg-red-700"}`}
          >
            {confirmLabel || "Confirmar"}
          </button>
        </>
      }
    >
      <div className="text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        {title && <h4 className="text-lg font-semibold text-cenit-800 dark:text-white mb-2">{title}</h4>}
        <p className="text-sm text-cenit-500 dark:text-cenit-300">{message}</p>
      </div>
    </Modal>
  );
}
