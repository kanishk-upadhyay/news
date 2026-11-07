import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";
import NewsCard from "../components/NewsCard";
import { containerStyles, editorialHeadingStyles } from "../utils/styles";
import { decodeHTML } from "../utils/textUtils";

export default function Bookmarks() {
  const { bookmarks, clearBookmarks, viewMode } = useApp();
  const [filterQuery, setFilterQuery] = useState("");

  const filteredBookmarks = bookmarks.filter((article) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const title = decodeHTML(article.webTitle).toLowerCase();
    const section = (article.sectionName || "").toLowerCase();
    return title.includes(q) || section.includes(q);
  });

  return (
    <main className="min-h-screen py-6 sm:py-10 bg-surface">
      <div className={containerStyles}>
        {/* Masthead Header */}
        <header className="mb-8 sm:mb-12 border-b border-divider pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500">
                Personal Archive
              </span>
            </div>
            <h1 className={editorialHeadingStyles}>Saved Articles</h1>
            <p className="text-on-surface-muted text-sm sm:text-base mt-2">
              Your offline-accessible reading list ({bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"} saved).
            </p>
          </div>

          {/* Search Filter & Clear All */}
          {bookmarks.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter saved stories..."
                  className="px-3.5 py-1.5 text-xs rounded-xl bg-card border border-divider text-on-surface placeholder:text-on-surface-muted outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all saved bookmarks?")) {
                    clearBookmarks();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-card border border-divider text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </header>

        {/* Empty State */}
        {bookmarks.length === 0 && (
          <div className="bg-card border border-divider rounded-3xl p-12 sm:p-16 text-center my-8 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-on-surface mb-2">
              Your reading list is empty
            </h3>
            <p className="text-on-surface-muted max-w-md mx-auto text-sm sm:text-base mb-6">
              Save articles while browsing to read them anytime, even when offline.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-on-surface text-card font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <span>Explore Top Stories</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Bookmarks Grid / List */}
        {bookmarks.length > 0 && (
          <div>
            {filteredBookmarks.length === 0 ? (
              <div className="text-center py-12 text-on-surface-muted text-sm">
                No saved articles match "{filterQuery}".
              </div>
            ) : viewMode === "magazine" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredBookmarks.map((article) => (
                  <NewsCard
                    key={article.id || article.webUrl}
                    article={article}
                    layout="magazine"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookmarks.map((article) => (
                  <NewsCard
                    key={article.id || article.webUrl}
                    article={article}
                    layout="digest"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
