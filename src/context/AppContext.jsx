import { useState, useEffect, useCallback } from "react";
import { AppContext } from "./appContextDef";

/**
 * Sanitizes article object to keep localStorage footprint minimal (<1KB per bookmark)
 */
const sanitizeBookmark = (article) => {
  if (!article) return null;
  return {
    id: article.id || article.webUrl,
    webTitle: article.webTitle || "Untitled Article",
    webUrl: article.webUrl || "#",
    webPublicationDate: article.webPublicationDate || new Date().toISOString(),
    sectionName: article.sectionName || "News",
    fields: {
      thumbnail: article.fields?.thumbnail || "",
      trailText: article.fields?.trailText || "",
      byline: article.fields?.byline || "",
      wordcount: article.fields?.wordcount || 0,
      shortUrl: article.fields?.shortUrl || "",
    },
  };
};

export const AppProvider = ({ children }) => {
  // Theme state ('dark' | 'light' | 'system')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("newshub_theme") || "dark";
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem("newshub_bookmarks");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to read bookmarks from localStorage", e);
      return [];
    }
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

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

  // Sync bookmarks with localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem("newshub_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Failed to persist bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  // Toast auto-dismiss timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const updateViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("newshub_view_mode", mode);
  };

  const isBookmarked = useCallback(
    (articleOrId) => {
      if (!articleOrId) return false;
      const targetId =
        typeof articleOrId === "string"
          ? articleOrId
          : articleOrId.id || articleOrId.webUrl;
      return bookmarks.some((b) => (b.id || b.webUrl) === targetId);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (article) => {
      if (!article) return false;
      const id = article.id || article.webUrl;
      const exists = bookmarks.some((b) => (b.id || b.webUrl) === id);

      if (exists) {
        setBookmarks((prev) => prev.filter((b) => (b.id || b.webUrl) !== id));
        showToast("Removed from saved stories", "info");
        return false;
      } else {
        const clean = sanitizeBookmark(article);
        if (clean) {
          setBookmarks((prev) => [clean, ...prev]);
          showToast("Saved to your reading list", "success");
          return true;
        }
        return false;
      }
    },
    [bookmarks, showToast]
  );

  const removeBookmark = useCallback(
    (id) => {
      setBookmarks((prev) => prev.filter((b) => (b.id || b.webUrl) !== id));
      showToast("Removed from saved stories", "info");
    },
    [showToast]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    showToast("Cleared all saved bookmarks", "info");
  }, [showToast]);

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
        toast,
        showToast,
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
