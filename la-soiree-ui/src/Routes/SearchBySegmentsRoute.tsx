import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BaseWindow } from "../components/BaseWindow";
import { ActiveWindowContext } from "../context/ActiveWindowContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SearchQueryContext } from "../context/SearchQueryContext";
import { SearchResultsContext } from "../context/SearchResultsContext";
import { formatDate, formatDuration } from "../util/formatting";
import { segmentToPlayable } from "../util/toPlayable";
import styles from "./SearchBySegmentsRoute.module.css";

export function SearchBySegmentsRoute() {
  const activeWindow = useContext(ActiveWindowContext);
  const [searchType, setSearchType] = useState<"segments" | "episodes">(
    "segments"
  );
  const { query, setQuery } = useContext(SearchQueryContext);
  const context = useContext(SearchResultsContext);
  const playlistContext = useContext(PlaylistContext);
  const navigate = useNavigate();

  const totalDuration = useMemo(() => {
    return context.segments.map((x) => x.duration).reduce((a, e) => a + e, 0);
  }, [context.segments]);

  function queueFromSegment(segmentId: number) {
    const index = context.segments.findIndex((s) => s.id === segmentId);
    playlistContext.setQueue(
      context.segments.slice(index).map(segmentToPlayable)
    );
  }
  useEffect(() => {
    if (query) {
      context.searchSegmentsByText(query);
    }
    activeWindow.setActiveWindow("Recherche");
  }, []);

  function submit() {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?q=" +
      query;
    window.history.pushState({ path: newurl }, "", newurl);
    context.searchSegmentsByText(query);
  }

  return (
    <BaseWindow
      title="Recherche"
      defaultHeight={600}
      defaultWidth={800}
      defaultLeft={40}
      onClose={() => navigate("/")}
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
                submit();
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
          <button className="btn" onClick={() => submit()}>
            Rechercher
          </button>
        </section>

        <div className={styles.resultContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Titre</th>
                <th style={{ width: "100px" }}>Date</th>
                <th style={{ width: "80px" }}>Durée</th>
              </tr>
            </thead>
            <tbody>
              {context.segments.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => {
                    queueFromSegment(s.id);
                    activeWindow.setActiveWindow("Player");
                  }}
                >
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
