import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HeaderBar } from "./components/HeaderBar";
import { Providers } from "./context/Providers";
import { SearchBySegmentsRoute } from "./Routes/SearchBySegmentsRoute";

function App() {
  return (
    <Providers>
      <div>
        <BrowserRouter>
          <div id="page-content">
            <HeaderBar />
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
