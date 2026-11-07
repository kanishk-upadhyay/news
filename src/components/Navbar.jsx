import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "../constants";
import { useApp } from "../context/useApp";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    theme,
    setTheme,
    bookmarks,
    openSearch,
    viewMode,
    setViewMode,
  } = useApp();

  const isCurrentCategory = (catId) => {
    return location.pathname === `/category/${catId}`;
  };

  const isBookmarksPage = location.pathname === "/bookmarks";

  const currentDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-divider transition-colors">
      {/* Upper Masthead Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Edition Date */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-on-surface hover:opacity-90 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
              News<span className="text-rose-500">Hub</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-on-surface-muted border-l border-divider pl-3">
              Global Edition
            </span>
          </Link>
          <span className="hidden lg:inline-block text-xs font-mono text-on-surface-muted">
            {currentDateString}
          </span>
        </div>

        {/* Action Controls: Search, View Mode, Bookmarks, Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card-subtle border border-divider hover:border-rose-500/50 text-on-surface-muted hover:text-on-surface text-xs font-medium transition-all cursor-pointer"
            title="Search articles (⌘K)"
            aria-label="Search articles"
          >
            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-divider">
              ⌘K
            </kbd>
          </button>

          {/* View Mode Toggle (Magazine vs Digest) */}
          <button
            onClick={() => setViewMode(viewMode === "magazine" ? "digest" : "magazine")}
            className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-card-subtle border border-divider hover:border-divider/80 text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
            title={viewMode === "magazine" ? "Switch to Compact Digest" : "Switch to Magazine Grid"}
            aria-label="Switch layout view"
          >
            {viewMode === "magazine" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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

          {/* Geometrically Perfect Dark / Light Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group p-2 rounded-xl bg-card-subtle border border-divider hover:border-divider/80 text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
            aria-label={`Toggle theme: switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              /* Flawless Symmetrical Sun Icon */
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
              /* Flawless Symmetrical Moon Icon */
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-card-subtle border border-divider text-on-surface-muted hover:text-on-surface"
            aria-label="Toggle menu"
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

      {/* Desktop Horizontal Category Navigation Strip */}
      <div className="hidden md:block border-t border-divider/60 bg-card-subtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = isCurrentCategory(cat.id);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? "bg-on-surface text-card shadow-sm"
                      : "text-on-surface-muted hover:text-on-surface hover:bg-card-subtle"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-divider bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Quick links: Bookmarks & View toggle */}
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
              onClick={() => setViewMode(viewMode === "magazine" ? "digest" : "magazine")}
              className="text-xs text-on-surface-muted hover:text-on-surface font-medium"
            >
              Mode: {viewMode === "magazine" ? "Magazine" : "Digest"}
            </button>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-wider text-on-surface-muted px-1">
            Desk Sections
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const active = isCurrentCategory(cat.id);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
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
    </header>
  );
}
