import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Account() {
  const { user } = useAuth();
  const location = useLocation();
  const { t, locale } = useI18n();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderPlaced = location.state?.orderPlaced;

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await api.get("/orders");
      setOrders(res.items);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrder(orderId) {
    if (!confirm(t("account.confirmDeleteOrder"))) return;
    try {
      await api.del(`/orders/${orderId}`);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="account">
      <h1>{t("account.title")}</h1>
      <div className="account__info">
        <div><strong>{t("account.name")}:</strong> {user?.name}</div>
        <div><strong>{t("account.email")}:</strong> {user?.email}</div>
      </div>

      {orderPlaced && (
        <div className="notice">{t("account.orderPlaced", { id: orderPlaced })}</div>
      )}

      <h2>{t("account.orders")}</h2>
      {loading ? (
        <div className="loading">{t("common.loading")}</div>
      ) : orders.length === 0 ? (
        <div className="empty">{t("account.noOrders")}</div>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-card__head">
                <span>{t("account.order", { id: o.id })}</span>
                <span>{new Date(o.created_at).toLocaleString(locale)}</span>
                <span className="order-card__status">{t(`admin.orderStatus.${o.status}`)}</span>
                <button className="link-button delete-order" onClick={() => deleteOrder(o.id)}>
                  {t("common.delete")}
                </button>
              </div>
              <ul className="order-card__items">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.artist} — {i.title} × {i.quantity} · ${(i.price * i.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="order-card__total">{t("account.total")}: ${o.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}