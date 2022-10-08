import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActiveWindowContext } from "../context/ActiveWindowContext";
import { SearchQueryContext } from "../context/SearchQueryContext";
import { SearchResultsContext } from "../context/SearchResultsContext";
import { BaseWindow } from "./BaseWindow";
import styles from "./Explorer.module.css";
import { Icon } from "./Icon";

type PredefinedQuery = {
  title: string;
  icon: string;
  query: string;
};

const PREDEFINED_QUERIES: PredefinedQuery[] = [
  {
    title: "Allô Bobo",
    icon: "stethoscope",
    query: "Allô Bobo",
  },
  {
    title: "Le monde international",
    icon: "world",
    query: "le monde international",
  },
  {
    title: "Le bêtisier",
    icon: "radio",
    query: "bêtisier",
  },
  {
    title: "Billet idéologique",
    icon: "megaphone",
    query: "billet idéologique",
  },
  {
    title: "Laser MP3-45",
    icon: "music",
    query: "mp3",
  },
  {
    title: "Sports",
    icon: "folder",
    query: "les sports",
  },
  {
    title: "Vu/pas vu",
    icon: "filmprojector",
    query: "pas vu",
  },
  {
    title: "Internetoscope",
    icon: "world",
    query: "internetoscope",
  },
  {
    title: "Culture-quiz",
    icon: "questionmark",
    query: "quiz",
  },
  {
    title: "Qui parle?",
    icon: "phone",
    query: "qui parle",
  },
].sort((a, b) => a.title.localeCompare(b.title));

export function Explorer() {
  const [isVisible, setIsVisible] = useState(true);
  const searchQuery = useContext(SearchQueryContext);
  const searchResult = useContext(SearchResultsContext);
  const activeWindow = useContext(ActiveWindowContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (activeWindow.activeWindow === "Explorateur") {
      setIsVisible(true);
    }
  }, [activeWindow.activeWindow]);
  if (!isVisible) {
    return <></>;
  }
  return (
    <BaseWindow
      title="Explorateur"
      defaultHeight={350}
      defaultWidth={550}
      onClose={() => {
        setIsVisible(false);
        activeWindow.setActiveWindow("");
      }}
    >
      <div className="details-bar">
        <span></span>
        <span></span>
        <span>{PREDEFINED_QUERIES.length} objets</span>
      </div>
      <div className={styles.iconContainer}>
        {PREDEFINED_QUERIES.map((q) => (
          <Icon
            key={q.title}
            icon={q.icon}
            text={q.title}
            onClick={() => {
              navigate("/recherche/segments");
              searchQuery.setQuery(q.query);
              searchResult.searchSegmentsByText(q.query);
              var newurl =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?q=" +
                q.query;
              window.history.pushState({ path: newurl }, "", newurl);
            }}
          />
        ))}
      </div>
    </BaseWindow>
  );
}
