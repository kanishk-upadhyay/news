import { useState, useEffect } from "react";
import { AppContext } from "./appContextDef";

export const AppProvider = ({ children }) => {
  // Theme state ('dark', 'light', 'system')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("newshub_theme") || "dark";
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem("newshub_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Reader Drawer active article
  const [activeArticle, setActiveArticle] = useState(null);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // View Mode: 'magazine' | 'digest'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("newshub_view_mode") || "magazine";
  });

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("newshub_theme", theme);
  }, [theme]);

  // Sync bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("newshub_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Failed to persist bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  // Sync viewMode with localStorage
  const updateViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("newshub_view_mode", mode);
  };

  const isBookmarked = (id) => {
    return bookmarks.some((b) => (b.id || b.webUrl) === id);
  };

  const toggleBookmark = (article) => {
    const id = article.id || article.webUrl;
    setBookmarks((prev) => {
      const exists = prev.some((b) => (b.id || b.webUrl) !== id);
      if (exists) {
        return prev.filter((b) => (b.id || b.webUrl) !== id);
      } else {
        return [article, ...prev];
      }
    });
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => (b.id || b.webUrl) !== id));
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  const openReader = (article) => {
    setActiveArticle(article);
  };

  const closeReader = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveArticle(null);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        bookmarks,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearBookmarks,
        activeArticle,
        openReader,
        closeReader,
        isSearchOpen,
        openSearch,
        closeSearch,
        viewMode,
        setViewMode: updateViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
