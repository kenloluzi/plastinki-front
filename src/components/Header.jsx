import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import LangSwitcher from "./LangSwitcher.jsx";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { t } = useI18n();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => setShowConfirm(true);
  const confirmLogout = () => { logout(); setShowConfirm(false); };
  const cancelLogout = () => setShowConfirm(false);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">PLASTINKI</Link>
        <nav className="nav">
          <NavLink to="/catalog">{t("nav.catalog")}</NavLink>
          {user?.is_admin && <NavLink to="/admin">{t("nav.admin")}</NavLink>}
          {user ? (
            <>
              <NavLink to="/account">{t("nav.account")}</NavLink>
              <button className="link-button delete-order" onClick={handleLogoutClick}>
                {t("nav.logout")}
              </button>
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

      {showConfirm && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>{t("auth.confirmLogout")}</p>
            <div className="modal-buttons">
              <button className="btn btn-danger" onClick={confirmLogout}>
                {t("common.yes")}
              </button>
              <button className="btn btn-secondary" onClick={cancelLogout}>
                {t("common.no")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}