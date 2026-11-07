import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "../constants";
import { useApp } from "../context/useApp";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    theme,
    toggleTheme,
    bookmarks,
    openSearch,
    viewMode,
    setViewMode,
  } = useApp();

  const isCurrentCategory = (catId) => {
    if (catId === "world") {
      return location.pathname === "/" || location.pathname === "/category/world";
    }
    return location.pathname === `/category/${catId}`;
  };

  const isBookmarksPage = location.pathname === "/bookmarks";

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-divider transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Integrated Top Navigation Bar */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="group flex items-baseline gap-2 text-on-surface hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
                News<span className="text-rose-500">Hub</span>
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono uppercase tracking-widest text-on-surface-muted border-l border-divider pl-2.5">
                Dispatch
              </span>
            </Link>
          </div>

          {/* Desktop Categories — Prominently at the Top */}
          <nav
            aria-label="Desk categories"
            className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar mx-2"
          >
            {CATEGORIES.map((cat) => {
              const active = isCurrentCategory(cat.id);
              const target = cat.id === "world" ? "/" : `/category/${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  to={target}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? "bg-on-surface text-card shadow-sm font-bold"
                      : "text-on-surface-muted hover:text-on-surface hover:bg-card-subtle"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls: Search, View Mode, Bookmarks, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-subtle border border-divider hover:border-rose-500/50 text-on-surface-muted hover:text-on-surface text-xs font-medium transition-all cursor-pointer"
              title="Search articles (⌘K)"
              aria-label="Search articles"
            >
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-divider">
                ⌘K
              </kbd>
            </button>

            {/* Layout Mode Toggle: Unambiguous 2x2 Grid vs Stacked List Icons (NO HAMBURGER!) */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "magazine" ? "digest" : "magazine")}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-card-subtle border border-divider hover:border-divider/80 text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
              title={viewMode === "magazine" ? "Switch to Compact List View" : "Switch to Magazine Grid View"}
              aria-label="Switch layout view"
            >
              {viewMode === "magazine" ? (
                /* Stacked Rows / List Icon (NOT a hamburger) */
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="6" rx="1.5" />
                  <rect x="3" y="14" width="18" height="6" rx="1.5" />
                </svg>
              ) : (
                /* 2x2 Magazine Grid Icon */
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              )}
            </button>

            {/* Bookmarks Link */}
            <Link
              to="/bookmarks"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isBookmarksPage
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-card-subtle border-divider text-on-surface hover:border-divider/80"
              }`}
              title="Saved Bookmarks"
              aria-label="Saved Bookmarks"
            >
              <svg
                className="w-4 h-4"
                fill={isBookmarksPage || bookmarks.length > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="hidden sm:inline">Saved</span>
              {bookmarks.length > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    isBookmarksPage ? "bg-white text-rose-600" : "bg-rose-500 text-white"
                  }`}
                >
                  {bookmarks.length}
                </span>
              )}
            </Link>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="group p-2 rounded-xl bg-card-subtle border border-divider hover:border-divider/80 text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
              aria-label={`Toggle theme: switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                /* Flawless Sun Icon */
                <svg
                  className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.25" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                /* Flawless Moon Icon */
                <svg
                  className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                </svg>
              )}
            </button>

            {/* Sole Single Mobile Hamburger Button (ONLY visible on small screens!) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-card-subtle border border-divider text-on-surface-muted hover:text-on-surface cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-divider py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-divider">
              <Link
                to="/bookmarks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-rose-500 hover:opacity-80"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Saved Articles ({bookmarks.length})</span>
              </Link>

              <button
                type="button"
                onClick={() => setViewMode(viewMode === "magazine" ? "digest" : "magazine")}
                className="text-xs text-on-surface-muted hover:text-on-surface font-medium"
              >
                Mode: {viewMode === "magazine" ? "Magazine" : "Digest"}
              </button>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-on-surface-muted px-1">
              Sections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const active = isCurrentCategory(cat.id);
                const target = cat.id === "world" ? "/" : `/category/${cat.id}`;
                return (
                  <Link
                    key={cat.id}
                    to={target}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      active
                        ? "bg-on-surface text-card font-bold"
                        : "bg-card-subtle text-on-surface border border-divider/50 hover:border-divider"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
