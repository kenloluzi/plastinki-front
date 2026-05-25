import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import RecordCard from "../components/RecordCard";
import { useI18n } from "../i18n/I18nContext";

export default function Catalog() {
  const { t } = useI18n();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search: debouncedSearch };
      const data = await api.get("/records", { params });
      setRecords(data.items || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div>
      <div className="catalog__header">
        <h2>{t("catalog.title")}</h2>
        <input
          type="text"
          placeholder="Поиск по названию или артисту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", width: "300px", borderRadius: "12px" }}
        />
      </div>

      <div className="grid">
        {records.map(record => <RecordCard key={record.id} record={record} />)}
      </div>

      {/* Пагинация */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`btn ${p === page ? "active" : ""}`}
            style={{ margin: "0 5px" }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}