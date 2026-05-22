import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import LangSwitcher from "./LangSwitcher.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { t } = useI18n();

  return (
    <header className="header">
      <Link to="/" className="logo">PLASTINKI</Link>
      <nav className="nav">
        <NavLink to="/catalog">{t("nav.catalog")}</NavLink>
        {user?.is_admin && <NavLink to="/admin">{t("nav.admin")}</NavLink>}
        {user ? (
          <>
            <NavLink to="/account">{t("nav.account")}</NavLink>
            <button className="link-button" onClick={logout}>{t("nav.logout")}</button>
          </>
        ) : (
          <NavLink to="/login">{t("nav.login")}</NavLink>
        )}
        <Link to="/cart" className="cart-link">
          {t("nav.cart")} ({count})
        </Link>
        <LangSwitcher />
      </nav>
    </header>
  );
}
