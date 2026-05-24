import { Link } from "react-router-dom";

export default function RecordCard({ record }) {
  return (
    <Link to={`/records/${record.id}`} className="record-card">
      <div className="record-card__image">
        {record.image_url ? (
          <img src={record.image_url} alt={record.title} loading="lazy" />
        ) : (
          <div className="record-card__placeholder" />
        )}
      </div>
      <div className="record-card__info">
        <div className="record-card__artist">{record.artist}</div>
        <div className="record-card__title">{record.title}</div>
        <div className="record-card__meta">
          <span>{record.year}</span>
          <span>${record.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}