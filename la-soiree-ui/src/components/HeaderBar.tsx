import styles from "./HeaderBar.module.css";

export function HeaderBar() {
  return (
    <div className={styles.rootBackground}>
      <div className={styles.container}>
        <ul role="menu-bar">
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Chroniques
            <ul role="menu">
              <li role="menu-item">
                <a href="#menu">Action</a>
              </li>
              <li role="menu-item">
                <a href="#menu">Another Action</a>
              </li>
            </ul>
          </li>
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Recherche
            <ul role="menu">
              <li role="menu-item">
                <a href="#menu">Épisodes</a>
              </li>
              <li role="menu-item">
                <a href="/recherche/segments">Segments</a>
              </li>
              <li role="menu-item">
                <a href="#menu">Occurrences</a>
              </li>
            </ul>
          </li>
          <li role="menu-item" tabIndex={0} aria-haspopup="true">
            Aide
            <ul role="menu">
              <li role="menu-item" className="divider">
                <a href="#menu">Manuel d'utilisation</a>
              </li>
              <li role="menu-item">
                <a href="#menu">À propos</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

type Props = {};

export function HeaderBarButton(props: Props) {
  return <></>;
}
