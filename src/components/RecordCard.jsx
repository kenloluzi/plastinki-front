import { Link } from "react-router-dom";
import { useState } from "react";

export default function RecordCard({ record }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();         // отменяем переход сразу
    setIsAnimating(true);       // запускаем анимацию

    setTimeout(() => {
      // после анимации переходим на страницу
      window.location.href = `/records/${record.id}`;
    }, 200);                    // длительность анимации 200ms
  };

  return (
    <Link
      to={`/records/${record.id}`}
      className={`record-card ${isAnimating ? "record-card--animate" : ""}`}
      onClick={handleClick}
    >
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