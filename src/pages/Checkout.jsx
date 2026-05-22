import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/client.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [shipping, setShipping] = useState({
    full_name: "",
    address: "",
    city: "",
    zip_code: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setShipping((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await api.post("/orders", {
        shipping,
        items: items.map((i) => ({ record_id: i.record_id, quantity: i.quantity })),
      });
      clear();
      navigate(`/account`, { state: { orderPlaced: order.id } });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <div className="empty">{t("checkout.empty")}</div>;
  }

  return (
    <div className="checkout">
      <h1>{t("checkout.title")}</h1>
      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={submit}>
          <h2>{t("checkout.shipping")}</h2>
          <label>
            {t("checkout.fullName")}
            <input
              required
              type="text"
              value={shipping.full_name}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </label>
          <label>
            {t("checkout.address")}
            <input
              required
              type="text"
              value={shipping.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
          <div className="checkout__row">
            <label>
              {t("checkout.city")}
              <input
                required
                type="text"
                value={shipping.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </label>
            <label>
              {t("checkout.zip")}
              <input
                required
                type="text"
                value={shipping.zip_code}
                onChange={(e) => update("zip_code", e.target.value)}
              />
            </label>
          </div>
          <label>
            {t("checkout.phone")}
            <input
              type="text"
              value={shipping.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </label>

          {error && <div className="form-error">{error}</div>}
          <button className="btn btn--block" disabled={submitting}>
            {submitting ? t("checkout.placing") : t("checkout.place")}
          </button>
          <p className="muted small">{t("checkout.demoNote")}</p>
        </form>

        <aside className="checkout__summary">
          <h2>{t("checkout.summary")}</h2>
          <ul>
            {items.map((i) => (
              <li key={i.record_id}>
                <span>{i.artist} — {i.title} × {i.quantity}</span>
                <span>${(Number(i.price) * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout__total">
            <span>{t("checkout.total")}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
