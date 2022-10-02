import { useContext, useMemo, useState } from "react";
import { BaseWindow } from "../components/BaseWindow";
import { SearchResultsContext } from "../context/SearchResultsContext";
import { formatDate, formatDuration } from "../util/formatting";
import styles from "./SearchBySegmentsRoute.module.css";

export function SearchBySegmentsRoute() {
  const [searchType, setSearchType] = useState<"segments" | "episodes">(
    "segments"
  );
  const [query, setQuery] = useState("");
  const context = useContext(SearchResultsContext);
  const totalDuration = useMemo(() => {
    return context.segments.map((x) => x.duration).reduce((a, e) => a + e, 0);
  }, [context.segments]);

  return (
      <BaseWindow title="Recherche" defaultHeight={600} defaultWidth={800}
	  >
      <div className="details-bar">
        <span>
          {" "}
          {context.segments.length}{" "}
          {context.segments.length === 1 ? "résultat" : "résultats"}
        </span>
        <span></span>
        <span>{formatDuration(totalDuration)}</span>
      </div>
      <div className={"window-pane " + styles.baseContainer}>
        <section className="field-row" style={{ justifyContent: "flex-start" }}>
          <label htmlFor="text_find" className="modeless-text">
            Mots clés:
          </label>
          <input
            style={{ flex: 1 }}
            value={query}
            onChange={(e) => setQuery(e.target.value as any)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                context.searchSegmentsByText(query);
              }
            }}
          />
        </section>
        <section
          className="field-row"
          style={{ justifyContent: "flex-end", userSelect: "none" }}
        >
          <div>
            <input
              className={styles.radio}
              id="radioSegments"
              type="radio"
              name="Segments"
              checked={searchType === "segments"}
              onChange={() => setSearchType("segments")}
            />
            <label htmlFor="radioSegments" style={{ paddingRight: 10 }}>
              Segments
            </label>
            <input
              className={styles.radio}
              id="radioEpisodes"
              type="radio"
              name="Episodes"
              checked={searchType === "episodes"}
              onChange={() => setSearchType("episodes")}
            />

            <label htmlFor="radioEpisodes">Episodes</label>
          </div>
          <button
            className="btn"
            onClick={() => context.searchSegmentsByText(query)}
          >
            Rechercher
          </button>
        </section>

        <div className={styles.resultContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Titre</th>
                <th>Date</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {context.segments.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td style={{ textAlign: "end" }}>
                    {formatDate(s.aired_date)}
                  </td>
                  <td style={{ textAlign: "end" }}>
                    {formatDuration(s.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseWindow>
  );
}

type RowProps = {};

export function ResultRow(props: RowProps) {
  return <div></div>;
}
