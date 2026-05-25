import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useI18n } from "../i18n/I18nContext";

export default function Header() {
  const { itemsCount } = useCart();
  const { t } = useI18n();
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="logo">PLASTINKI</Link>
      
      <nav className="nav">
        <Link to="/catalog" className={location.pathname === "/catalog" ? "active" : ""}>
          {t("nav.catalog") || "Catalog"}
        </Link>
        <Link to="/account">{t("nav.account") || "Account"}</Link>
        <Link to="/cart" className="cart-link">
          {t("nav.cart") || "Cart"} {itemsCount > 0 && `(${itemsCount})`}
        </Link>
        <LangSwitcher />
      </nav>
    </header>
  );
}