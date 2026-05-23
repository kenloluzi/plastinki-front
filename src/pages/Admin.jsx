import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useI18n } from "../i18n/I18nContext.jsx";

const EMPTY = {
  title: "",
  artist: "",
  year: "",
  genre: "",
  condition: "new",
  price: "",
  stock: 1,
  image_url: "",
  description: "",
};

export default function Admin() {
  const { t, locale } = useI18n();
  const [tab, setTab] = useState("records");
  const [records, setRecords] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);

  useEffect(() => { loadRecords(); loadOrders(); }, []);

  function loadRecords() {
    api.get("/admin/records").then((res) => setRecords(res.items)).catch(() => {});
  }

  function loadOrders() {
    api.get("/admin/orders").then((res) => setOrders(res.items)).catch(() => {});
  }

  async function deleteOrder(orderId) {
    if (!confirm(t("admin.confirmDeleteOrder"))) return;
    try {
      await api.del(`/orders/${orderId}`);
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  // ... остальные функции (startEdit, cancelEdit, save, remove, setStatus) без изменений ...

  return (
    <div className="admin">
      <h1>{t("admin.title")}</h1>
      <div className="admin__tabs">
        <button className={tab === "records" ? "active" : ""} onClick={() => setTab("records")}>
          {t("admin.tabs.records")}
        </button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
          {t("admin.tabs.orders")}
        </button>
      </div>

      {tab === "records" && (
        // ... форма и таблица (без изменений) ...
      )}

      {tab === "orders" && (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-card__head">
                <span>{t("account.order", { id: o.id })}</span>
                <span>{new Date(o.created_at).toLocaleString(locale)}</span>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                  <option value="pending">{t("admin.orderStatus.pending")}</option>
                  <option value="paid">{t("admin.orderStatus.paid")}</option>
                  <option value="shipped">{t("admin.orderStatus.shipped")}</option>
                  <option value="cancelled">{t("admin.orderStatus.cancelled")}</option>
                </select>
                <button className="link-button delete-order" onClick={() => deleteOrder(o.id)}>
                  {t("common.delete")}
                </button>
              </div>
              <div className="muted small">
                {o.full_name} · {o.address}, {o.city} {o.zip_code}
                {o.phone ? ` · ${o.phone}` : ""}
              </div>
              <ul className="order-card__items">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.artist} — {i.title} × {i.quantity} · ${(i.price * i.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="order-card__total">{t("admin.orderTotal")}: ${o.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}