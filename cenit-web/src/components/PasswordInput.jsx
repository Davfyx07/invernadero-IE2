import { useState } from "react";

export default function PasswordInput({ value, onChange, placeholder, required, label, name, className = "" }) {
  const [show, setShow] = useState(false);
  const baseCls =
    "w-full rounded-xl border border-cenit-200 dark:border-cenit-600 bg-cenit-50 dark:bg-cenit-900 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-cenit-800 dark:text-white placeholder:text-cenit-300 pr-10";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-cenit-700 dark:text-cenit-200 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseCls}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cenit-400 hover:text-cenit-600 dark:hover:text-cenit-300 transition"
          tabIndex={-1}
        >
          {show ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
