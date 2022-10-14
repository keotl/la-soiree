import { useContext } from "react";
import { Link } from "react-router-dom";
import { ActiveWindowContext } from "../context/ActiveWindowContext";
import styles from "./HeaderBar.module.css";

export function HeaderBar() {
  const windowContext = useContext(ActiveWindowContext);
  return (
    <div className={styles.rootBackground}>
      <div className={styles.container}>
        <ul role="menu-bar">
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Chroniques
            <ul role="menu">
              <li role="menu-item">
                <a onClick={() => windowContext.setActiveWindow("Explorateur")}>
                  Explorateur
                </a>
              </li>
            </ul>
          </li>
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Recherche
            <ul role="menu">
              {/*<li role="menu-item">
                <a href="#menu">Épisodes</a>
		</li>*/}
              <li role="menu-item">
                <Link to="/recherche/segments">Segments</Link>
              </li>

              {/*<li role="menu-item">
                <a href="#menu">Occurrences</a>
		</li>*/}
            </ul>
          </li>
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Aide
            <ul role="menu">
              {/*<li role="menu-item" className="divider">
                <a href="#menu">Manuel d'utilisation</a>
		</li>*/}
              <li role="menu-item">
                <a onClick={() => windowContext.setActiveWindow("about")}>
                  À propos
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
