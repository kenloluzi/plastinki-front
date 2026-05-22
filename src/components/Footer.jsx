import { useI18n } from "../i18n/I18nContext.jsx";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div>&copy; {new Date().getFullYear()} PLASTINKI</div>
      <div>{t("footer.tagline")}</div>
    </footer>
  );
}
