import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import RecordCard from "../components/RecordCard.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Catalog() {
  const [records, setRecords] = useState([]);
  const [facets, setFacets] = useState({ genres: [], artists: [], years: [] });
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const [filters, setFilters] = useState({
    genre: "",
    artist: "",
    year_min: "",
    year_max: "",
    price_min: "",
    price_max: "",
    search: "",
    sort: "newest",
  });

  useEffect(() => {
    api.get("/records/facets").then(setFacets).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== null) params.append(k, v);
    });
    api.get(`/records?${params.toString()}`)
      .then((res) => setRecords(res.items))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [filters]);

  function update(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFilters({
      genre: "",
      artist: "",
      year_min: "",
      year_max: "",
      price_min: "",
      price_max: "",
      search: "",
      sort: "newest",
    });
  }

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
        {loading ? (
          <div className="loading">{t("common.loading")}</div>
        ) : records.length === 0 ? (
          <div className="empty">{t("catalog.empty")}</div>
        ) : (
          <div className="grid">
            {records.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
