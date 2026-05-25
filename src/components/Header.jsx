import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../context/ThemeContext";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  const { itemsCount } = useCart();
  const { t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="logo">PLASTINKI</Link>
      
      <nav className="nav">
        <Link to="/catalog" className={location.pathname === "/catalog" ? "active" : ""}>
          {t("nav.catalog")}
        </Link>
        <Link to="/account">{t("nav.account")}</Link>
        <Link to="/cart" className="cart-link">
          {t("nav.cart")} {itemsCount > 0 && `(${itemsCount})`}
        </Link>
        <button onClick={toggleTheme} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>
          {isDark ? "☀️" : "🌙"}
        </button>
        <LangSwitcher />
      </nav>
    </header>
  );
}