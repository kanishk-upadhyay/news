import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewsFeed from "./pages/NewsFeed";
import { NEWS_CONFIG } from "./constants";

function App() {
  return (
    <HashRouter>
      <div className="surface min-h-screen">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={`/category/${NEWS_CONFIG.DEFAULT_CATEGORY}`} />
            }
          />
          <Route path="/category/:category" element={<NewsFeed />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
