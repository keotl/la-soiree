import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Explorer } from "./components/Explorer";
import { HeaderBar } from "./components/HeaderBar";
import { Player } from "./components/Player";
import { Providers } from "./context/Providers";
import { SearchBySegmentsRoute } from "./Routes/SearchBySegmentsRoute";

function App() {
  return (
    <Providers>
      <div>
        <BrowserRouter>
          <div id="page-content">
            <HeaderBar />
          <Player />
	  <Explorer />
            <Routes>
              <Route
                path="recherche/segments"
                element={<SearchBySegmentsRoute />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </Providers>
  );
}

export default App;
