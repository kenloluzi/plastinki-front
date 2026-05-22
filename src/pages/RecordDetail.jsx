import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { t } = useI18n();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/records/${id}`).then(setRecord).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="empty">{error}</div>;
  if (!record) return <div className="loading">{t("common.loading")}</div>;

  function handleAdd() {
    add(record);
    navigate("/cart");
  }

  return (
    <div className="record-detail">
      <div className="record-detail__image">
        {record.image_url ? (
          <img src={record.image_url} alt={record.title} />
        ) : (
          <div className="record-card__placeholder" />
        )}
      </div>
      <div className="record-detail__info">
        <div className="record-detail__artist">{record.artist}</div>
        <h1 className="record-detail__title">{record.title}</h1>
        <div className="record-detail__meta">
          <span>{record.year}</span>
          <span>{record.genre}</span>
          <span>{record.condition === "new" ? t("record.conditionNew") : t("record.conditionUsed")}</span>
        </div>
        <div className="record-detail__price">${record.price.toFixed(2)}</div>
        {record.description && <p className="record-detail__desc">{record.description}</p>}
        <button
          className="btn btn--block"
          onClick={handleAdd}
          disabled={record.stock <= 0}
        >
          {record.stock > 0 ? t("record.addToCart") : t("record.outOfStock")}
        </button>
      </div>
    </div>
  );
}
