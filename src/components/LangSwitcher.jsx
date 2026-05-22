import { useI18n } from "../i18n/I18nContext.jsx";

export default function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "ru" ? "active" : ""}
        onClick={() => setLang("ru")}
      >
        RU
      </button>
      <span className="lang-switcher__sep">/</span>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}
