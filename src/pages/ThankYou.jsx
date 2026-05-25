import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";

export default function ThankYou() {
  const { t } = useI18n();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>🎉 {t("thankyou.title")}</h1>
      <p>{t("thankyou.message")}</p>
      {orderId && <p>Номер заказа: <strong>#{orderId}</strong></p>}
      
      <Link to="/account" className="btn">Перейти в личный кабинет</Link>
      <Link to="/catalog" className="btn" style={{ marginLeft: "12px" }}>
        Продолжить покупки
      </Link>
    </div>
  );
}