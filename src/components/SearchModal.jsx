import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/useApp";
import { fetchNews } from "../api/NewsApi";
import { decodeHTML, formatRelativeTime } from "../utils/textUtils";

const QUICK_TOPICS = [
  "Artificial Intelligence",
  "Semiconductors",
  "Climate Policy",
  "Global Economy",
  "Space Exploration",
  "Biotech",
];

export default function SearchModal() {
  const { isSearchOpen, openSearch, closeSearch, openReader, isBookmarked, toggleBookmark } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  // Global hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else openSearch();
      } else if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, openSearch, closeSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Debounced Search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetchNews({ query: trimmed, category: "all", pageSize: 12 })
        .then((data) => {
          setResults(data.results || []);
          setSearched(true);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setResults([]);
          setSearched(true);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setLoading(false);
    closeSearch();
  };

  if (!isSearchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm transition-all"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-divider rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-divider gap-3 bg-card-subtle/50">
          <svg
            className="w-5 h-5 text-on-surface-muted shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search global journalism, topics, leaders..."
            className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-on-surface placeholder:text-on-surface-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
              className="p-1 rounded-full text-on-surface-muted hover:text-on-surface cursor-pointer"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-medium rounded border border-divider text-on-surface-muted bg-card">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-5 border-b border-divider">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3 font-mono">
              Suggested Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setQuery(topic)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-card border border-divider hover:border-rose-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="overflow-y-auto p-3 flex-1 divide-y divide-divider/50">
          {loading && (
            <div className="p-8 text-center text-on-surface-muted flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Searching the global archive...</p>
            </div>
          )}

          {!loading && searched && query.trim() && results.length === 0 && (
            <div className="p-8 text-center text-on-surface-muted">
              <p className="font-serif text-lg font-bold text-on-surface mb-1">No articles found</p>
              <p className="text-sm">Try querying different keywords or checking spelling.</p>
            </div>
          )}

          {!loading &&
            results.map((article) => {
              const title = decodeHTML(article.webTitle);
              const bookmarked = isBookmarked(article);

              return (
                <div
                  key={article.id}
                  onClick={() => {
                    openReader(article);
                    handleClose();
                  }}
                  className="p-3 hover:bg-card-subtle rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-500">
                        {article.sectionName}
                      </span>
                      <span className="text-xs text-on-surface-muted">
                        • {formatRelativeTime(article.webPublicationDate)}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-on-surface group-hover:text-rose-500 transition-colors line-clamp-2">
                      {title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Direct Bookmark button in search results */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(article);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        bookmarked
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-card border-divider text-on-surface-muted hover:text-on-surface"
                      }`}
                      title={bookmarked ? "Remove Bookmark" : "Save for later"}
                      aria-label="Bookmark article"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill={bookmarked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>

                    {article.fields?.thumbnail && (
                      <img
                        src={article.fields.thumbnail}
                        alt=""
                        className="w-16 h-12 object-cover rounded-lg shrink-0 border border-divider"
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
