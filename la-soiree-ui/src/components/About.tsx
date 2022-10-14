import { useContext, useEffect, useState } from "react";
import { ActiveWindowContext } from "../context/ActiveWindowContext";

export function About() {
  const windowContext = useContext(ActiveWindowContext);
  const [visible, setVisible] = useState(
    windowContext.activeWindow === "about"
  );
  useEffect(() => {
    if (windowContext.activeWindow === "about") {
      setVisible(true);
    }
  }, [windowContext.activeWindow, setVisible]);

  if (!visible) {
    return <></>;
  }
  return (
    <div
      className="standard-dialog center scale-down"
      style={{
        width: "30rem",
        zIndex: 999999,
        position: "absolute",
        left: "30vw",
        marginTop: "20rem",
      }}
    >
      <h1 className="dialog-text">La soirée est encore mal citée</h1>
      <p className="dialog-text">
        Un outil de recherche de segments d'épisodes de{" "}
        <i>La soirée est encore jeune.</i>
      </p>
      <p className="dialog-text">
        <a href="https://github.com/keotl/la-soiree">
          https://github.com/keotl/la-soiree
        </a>
      </p>
      <button className="btn" onClick={() => setVisible(false)}>
        OK
      </button>
    </div>
  );
}
