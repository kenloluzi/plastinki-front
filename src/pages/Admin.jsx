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
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadRecords();
    loadOrders();
  }, []);

  function loadRecords() {
    api.get("/admin/records")
      .then((res) => setRecords(res.items))
      .catch(() => {});
  }

  function loadOrders() {
    api.get("/admin/orders")
      .then((res) => setOrders(res.items))
      .catch(() => {});
  }

  function startEdit(r) {
    setEditing(r.id);
    setForm({ ...r, year: r.year ?? "", description: r.description ?? "" });
    setImagePreview(r.image_url || "");
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setImagePreview("");
  }

  async function save(e) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
    };
    try {
      if (editing) {
        await api.put(`/admin/records/${editing}`, payload);
      } else {
        await api.post("/admin/records", payload);
      }
      cancelEdit();
      loadRecords();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(id) {
    if (!confirm(t("admin.confirmDelete"))) return;
    await api.del(`/admin/records/${id}`);
    loadRecords();
  }

  async function setStatus(orderId, status) {
    await api.put(`/admin/orders/${orderId}`, { status });
    loadOrders();
  }

  async function deleteOrder(orderId) {
    if (!confirm(t("admin.confirmDeleteOrder"))) return;
    try {
      await api.del(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (e) {
      alert(e.message);
    }
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, image_url: url });
    setImagePreview(url);
  };

  return (
    <div className="admin">
      <h1>{t("admin.title")}</h1>
      <div className="admin__tabs">
        <button
          className={tab === "records" ? "active" : ""}
          onClick={() => setTab("records")}
        >
          {t("admin.tabs.records")}
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          {t("admin.tabs.orders")}
        </button>
      </div>

      {tab === "records" && (
        <>
          <form className="admin__form" onSubmit={save}>
            <h2>
              {editing
                ? t("admin.formEdit", { id: editing })
                : t("admin.formAdd")}
            </h2>
            <div className="admin__row">
              <div style={{ flex: 1 }}>
                <input
                  placeholder={t("admin.fields.imageUrl")}
                  value={form.image_url}
                  onChange={handleImageUrlChange}
                />
              </div>
              {imagePreview && (
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
            <div className="admin__row">
              <input
                placeholder={t("admin.fields.title")}
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                placeholder={t("admin.fields.artist")}
                required
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
              />
            </div>
            <div className="admin__row">
              <input
                type="number"
                placeholder={t("admin.fields.year")}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
              <input
                placeholder={t("admin.fields.genre")}
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                <option value="new">{t("admin.conditionNew")}</option>
                <option value="used">{t("admin.conditionUsed")}</option>
              </select>
            </div>
            <div className="admin__row">
              <input
                type="number"
                step="0.01"
                placeholder={t("admin.fields.price")}
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="number"
                placeholder={t("admin.fields.stock")}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <textarea
              placeholder={t("admin.fields.description")}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {error && <div className="form-error">{error}</div>}
            <div className="admin__actions">
              <button className="btn" type="submit">
                {editing ? t("admin.save") : t("admin.add")}
              </button>
              {editing && (
                <button
                  type="button"
                  className="link-button"
                  onClick={cancelEdit}
                >
                  {t("admin.cancel")}
                </button>
              )}
            </div>
          </form>

          <table className="admin__table">
            <thead>
              <tr>
                <th>{t("admin.table.id")}</th>
                <th>{t("admin.table.image")}</th>
                <th>{t("admin.table.artist")}</th>
                <th>{t("admin.table.title")}</th>
                <th>{t("admin.table.year")}</th>
                <th>{t("admin.table.genre")}</th>
                <th>{t("admin.table.condition")}</th>
                <th>{t("admin.table.price")}</th>
                <th>{t("admin.table.stock")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        alt={r.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "#eee",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </td>
                  <td>{r.artist}</td>
                  <td>{r.title}</td>
                  <td>{r.year}</td>
                  <td>{r.genre}</td>
                  <td>{r.condition === "new" ? t("admin.conditionNew") : t("admin.conditionUsed")}</td>
                  <td>${r.price.toFixed(2)}</td>
                  <td>{r.stock}</td>
                  <td>
                    <button className="link-button" onClick={() => startEdit(r)}>
                      {t("admin.edit")}
                    </button>
                    <button className="link-button" onClick={() => remove(r.id)}>
                      {t("admin.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "orders" && (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-card">
              <div className="order-card__head">
                <span>{t("account.order", { id: o.id })}</span>
                <span>{new Date(o.created_at).toLocaleString(locale)}</span>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                >
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
                    {i.artist} — {i.title} × {i.quantity} · $
                    {(i.price * i.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="order-card__total">
                {t("admin.orderTotal")}: ${o.total.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}