import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewsFeed from "./pages/NewsFeed";
import { NEWS_CONFIG } from "./constants";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
