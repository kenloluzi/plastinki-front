import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, LOCALE_MAP } from "./translations.js";

const I18nContext = createContext(null);
const STORAGE_KEY = "plastinki_lang";
const DEFAULT_LANG = "ru";

function resolve(obj, path) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

function format(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && translations[saved] ? saved : DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (translations[next]) setLangState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations[DEFAULT_LANG];
      const value = resolve(dict, key);
      if (typeof value !== "string") return key;
      return format(value, vars);
    },
    [lang]
  );

  const locale = LOCALE_MAP[lang] || "en-US";

  const value = useMemo(() => ({ lang, setLang, t, locale }), [lang, setLang, t, locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
