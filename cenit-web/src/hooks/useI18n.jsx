import { useState, useEffect, useCallback, createContext, useContext } from "react";

const I18nContext = createContext(null);

const loadLocale = async (locale) => {
  try {
    const mod = await import(`../i18n/${locale}.json`);
    return mod.default || mod;
  } catch {
    const fallback = await import("../i18n/es.json");
    return fallback.default || fallback;
  }
};

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const stored = localStorage.getItem("cenit-locale");
    if (stored) return stored;
    const nav = navigator.language.split("-")[0];
    const supported = ["es", "en", "fr", "it"];
    return supported.includes(nav) ? nav : "es";
  });

  const [messages, setMessages] = useState({});

  useEffect(() => {
    loadLocale(locale).then(setMessages);
    localStorage.setItem("cenit-locale", locale);
  }, [locale]);

  const t = useCallback(
    (key, fallback = key) => {
      const parts = key.split(".");
      let val = messages;
      for (const part of parts) {
        val = val?.[part];
        if (val === undefined) return fallback;
      }
      return val;
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de I18nProvider");
  return ctx;
}
