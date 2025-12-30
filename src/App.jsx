import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewsFeed from "./pages/NewsFeed";
import { NEWS_CONFIG } from "./constants";

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
