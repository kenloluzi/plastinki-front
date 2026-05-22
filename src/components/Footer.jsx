import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="footer__legal">
        <Link to="/privacy">Политика конфиденциальности</Link>
        <span className="sep">|</span>
        <Link to="/terms">Пользовательское соглашение</Link>
      </div>
      <div>&copy; {new Date().getFullYear()} PLASTINKI</div>
      <div>{t("footer.tagline")}</div>
    </footer>
  );
}