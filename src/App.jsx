import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import BreakingTicker from "./components/BreakingTicker";
import Navbar from "./components/Navbar";
import SearchModal from "./components/SearchModal";
import ReaderDrawer from "./components/ReaderDrawer";
import Toast from "./components/Toast";
import NewsFeed from "./pages/NewsFeed";
import Bookmarks from "./pages/Bookmarks";
import { NEWS_CONFIG, CATEGORIES } from "./constants";

// Scroll to top on every route transition
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      {/* Top Breaking Marquee Ticker */}
      <BreakingTicker />

      {/* Main Sticky Masthead */}
      <Navbar />

      {/* Main Content View */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<NewsFeed />} />
          <Route path="/category/:category" element={<NewsFeed />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Interactive Overlays */}
      <SearchModal />
      <ReaderDrawer />
      <Toast />

      {/* Editorial Footer */}
      <footer className="bg-card border-t border-divider mt-auto py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-divider/60">
            {/* Brand column */}
            <div className="md:col-span-5">
              <span className="font-serif text-2xl font-extrabold tracking-tight text-on-surface">
                News<span className="text-rose-500">Hub</span>
              </span>
              <p className="text-on-surface-muted text-sm mt-2 max-w-sm leading-relaxed">
                Independent real-time global news intelligence. Delivering curated reporting, deep dives, and breaking perspectives from across the world.
              </p>
            </div>

            {/* Quick sections */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface mb-3">
                Sections
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.id === "world" ? "/" : `/category/${cat.id}`}
                    className="text-on-surface-muted hover:text-rose-500 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Meta & Links */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface mb-3">
                Ecosystem
              </h4>
              <ul className="space-y-2 text-xs text-on-surface-muted">
                <li>
                  <Link to="/bookmarks" className="hover:text-rose-500 transition-colors">
                    Saved Bookmarks
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/kanishk-upadhyay/news"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-500 transition-colors inline-flex items-center gap-1"
                  >
                    <span>GitHub Repository</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://open-platform.theguardian.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-500 transition-colors inline-flex items-center gap-1"
                  >
                    <span>The Guardian Open API</span>
                    <span>↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-on-surface-muted">
            <p>© {new Date().getFullYear()} NewsHub • Curated by Kanishk Upadhyay</p>
            <p>Powered by React 19 & Tailwind CSS v4</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/news">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
