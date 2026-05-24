import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RecordCard({ record }) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);  // снимаем класс, чтобы карточка вернулась в норму
      setTimeout(() => {
        navigate(`/records/${record.id}`);
      }, 50); // небольшая задержка, чтобы визуально вернулась
    }, 250); // длительность анимации увеличения
  };

  return (
    <Link
      to={`/records/${record.id}`}
      className={`record-card ${isAnimating ? "record-card--pop" : ""}`}
      onClick={handleClick}
    >
      {/* ... содержимое карточки ... */}
    </Link>
  );
}