import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Cart() {
  const { items, setQuantity, remove, total } = useCart();
  const { t } = useI18n();

  if (items.length === 0) {
    return (
      <div className="cart">
        <h1>{t("cart.title")}</h1>
        <div className="empty">{t("cart.empty")}</div>
        <Link to="/catalog" className="btn">{t("cart.browse")}</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>{t("cart.title")}</h1>
      <ul className="cart-list">
        {items.map((i) => (
          <li key={i.record_id} className="cart-item">
            <div className="cart-item__image">
              {i.image_url && <img src={i.image_url} alt={i.title} />}
            </div>
            <div className="cart-item__info">
              <div className="cart-item__artist">{i.artist}</div>
              <div className="cart-item__title">{i.title}</div>
              <div className="cart-item__price">${Number(i.price).toFixed(2)}</div>
            </div>
            <div className="cart-item__controls">
              <input
                type="number"
                min="1"
                value={i.quantity}
                onChange={(e) => setQuantity(i.record_id, parseInt(e.target.value, 10) || 1)}
              />
              <button className="link-button" onClick={() => remove(i.record_id)}>{t("cart.remove")}</button>
            </div>
            <div className="cart-item__line">${(Number(i.price) * i.quantity).toFixed(2)}</div>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <span>{t("cart.total")}</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Link to="/checkout" className="btn btn--block">{t("cart.checkout")}</Link>
    </div>
  );
}
