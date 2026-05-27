import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../api/client.js";
import RecordCard from "../components/RecordCard.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Catalog() {
  const [records, setRecords] = useState([]);
  const [facets, setFacets] = useState({ genres: [], artists: [], years: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useI18n();
  const [filters, setFilters] = useState({
    genre: "",
    artist: "",
    condition: "",
    year_min: "",
    year_max: "",
    price_min: "",
    price_max: "",
    search: "",
    sort: "newest",
  });

  const debounceTimer = useRef(null);

  // Загрузка facets
  useEffect(() => {
    api.get("/records/facets").then(setFacets).catch(() => {});
  }, []);

  // Общая функция загрузки с текущей страницей и фильтрами
  const loadRecords = useCallback(async (resetPage = true) => {
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== null) params.append(k, v);
    });
    params.append("page", resetPage ? 1 : page);
    params.append("per_page", 12);

    try {
      const res = await api.get(`/records?${params.toString()}`);
      if (resetPage) {
        setRecords(res.items);
      } else {
        setRecords(prev => [...prev, ...res.items]);
      }
      setTotalPages(res.pages);
      if (!resetPage) setPage(prev => prev + 1);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // При изменении фильтров сбрасываем страницу
  useEffect(() => {
    loadRecords(true);
  }, [filters.genre, filters.artist, filters.condition, filters.year_min, filters.year_max, filters.price_min, filters.price_max, filters.sort]);

  // Дебаунс для поиска
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadRecords(true);
    }, 400);
  }, [filters.search]);

  function update(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFilters({
      genre: "",
      artist: "",
      condition: "",
      year_min: "",
      year_max: "",
      price_min: "",
      price_max: "",
      search: "",
      sort: "newest",
    });
    setPage(1);
  }

  const loadMore = () => {
    if (page < totalPages) {
      loadRecords(false);
    }
  };

  return (
    <div className="catalog">
      <aside className="filters">
        {/* ... все фильтры как раньше ... */}
        {/* (копируй блок фильтров из предыдущего кода) */}
      </aside>

      <section className="catalog__results">
        <div className="catalog__header">
          <h2>{t("catalog.title")}</h2>
          <span className="muted">{t("catalog.count", { n: records.length })}</span>
        </div>
        {loading && records.length === 0 ? (
          <div className="loading">{t("common.loading")}</div>
        ) : records.length === 0 ? (
          <div className="empty">{t("catalog.empty")}</div>
        ) : (
          <>
            <div className="grid">
              {records.map((r) => (
                <RecordCard key={r.id} record={r} />
              ))}
            </div>
            {page <= totalPages && (
              <div className="pagination">
                {page > 1 && (
                  <button className="btn" onClick={() => { setPage(p => p-1); loadRecords(true); }}>
                    {t("catalog.prevPage")}
                  </button>
                )}
                <span className="pagination__info">
                  {t("catalog.pageInfo", { current: page, total: totalPages })}
                </span>
                {page < totalPages && (
                  <button className="btn" onClick={loadMore}>
                    {t("catalog.nextPage")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}