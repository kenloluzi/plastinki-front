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

  // Загрузка facets (жанры, исполнители, годы)
  useEffect(() => {
    api.get("/records/facets").then(setFacets).catch(() => {});
  }, []);

  // Функция загрузки записей
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

  // При изменении основных фильтров сбрасываем страницу
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
        <div className="filters__group">
          <label>{t("catalog.search")}</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder={t("catalog.searchPlaceholder")}
          />
        </div>

        <div className="filters__group">
          <label>{t("catalog.genre")}</label>
          <select value={filters.genre} onChange={(e) => update("genre", e.target.value)}>
            <option value="">{t("catalog.allGenres")}</option>
            {facets.genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filters__group">
          <label>{t("catalog.artist")}</label>
          <select value={filters.artist} onChange={(e) => update("artist", e.target.value)}>
            <option value="">{t("catalog.allArtists")}</option>
            {facets.artists.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="filters__group">
          <label>{t("catalog.condition")}</label>
          <select value={filters.condition} onChange={(e) => update("condition", e.target.value)}>
            <option value="">{t("catalog.allConditions")}</option>
            <option value="new">{t("catalog.conditionNew")}</option>
            <option value="used">{t("catalog.conditionUsed")}</option>
          </select>
        </div>

        <div className="filters__group">
          <label>{t("catalog.year")}</label>
          <div className="filters__row">
            <input
              type="number"
              placeholder={t("catalog.from")}
              value={filters.year_min}
              onChange={(e) => update("year_min", e.target.value)}
            />
            <input
              type="number"
              placeholder={t("catalog.to")}
              value={filters.year_max}
              onChange={(e) => update("year_max", e.target.value)}
            />
          </div>
        </div>

        <div className="filters__group">
          <label>{t("catalog.price")}</label>
          <div className="filters__row">
            <input
              type="number"
              placeholder={t("catalog.min")}
              value={filters.price_min}
              onChange={(e) => update("price_min", e.target.value)}
            />
            <input
              type="number"
              placeholder={t("catalog.max")}
              value={filters.price_max}
              onChange={(e) => update("price_max", e.target.value)}
            />
          </div>
        </div>

        <div className="filters__group">
          <label>{t("catalog.sort")}</label>
          <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="newest">{t("catalog.sortNewest")}</option>
            <option value="price_asc">{t("catalog.sortPriceAsc")}</option>
            <option value="price_desc">{t("catalog.sortPriceDesc")}</option>
            <option value="year_desc">{t("catalog.sortYearDesc")}</option>
          </select>
        </div>

        <button className="filters__reset" onClick={reset}>{t("catalog.reset")}</button>
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