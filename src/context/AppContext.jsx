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
  // Theme state: defaults to device's OS preference if no manual override is saved
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("newshub_theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
      // Automatically detect device system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  // Track if user explicitly clicked toggle to override system theme
  const [hasManualOverride, setHasManualOverride] = useState(() => {
    try {
      return !!localStorage.getItem("newshub_theme");
    } catch {
      return false;
    }
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

  // Synchronize document class with active theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Listen to live OS system theme changes if user has not set a permanent override
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // If user hasn't explicitly locked a theme, follow the device
      if (!localStorage.getItem("newshub_theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // Update theme manually (and save preference)
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("newshub_theme", next);
      } catch (e) {
        console.warn("Could not save theme to localStorage", e);
      }
      setHasManualOverride(true);
      return next;
    });
  }, []);

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
        toggleTheme,
        hasManualOverride,
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
