import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import RecordCard from "../components/RecordCard.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Home() {
  const [records, setRecords] = useState([]);
  const { t } = useI18n();

  useEffect(() => {
    api.get("/records?sort=newest").then((res) => setRecords(res.items.slice(0, 15))).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">{t("home.title")}</h1>
        <Link to="/catalog" className="hero__cta">{t("home.cta")}</Link>
      </section>

      <section className="featured">
        <div className="grid">
          {records.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
