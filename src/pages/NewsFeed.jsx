import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchNews } from "../api/NewsApi";
import HeroCard from "../components/HeroCard";
import NewsCard from "../components/NewsCard";
import SkeletonCard from "../components/SkeletonCard";
import { CATEGORIES, SORT_OPTIONS, NEWS_CONFIG } from "../constants";
import { containerStyles, editorialHeadingStyles } from "../utils/styles";
import { useApp } from "../context/useApp";

export default function NewsFeed() {
  const { category = NEWS_CONFIG.DEFAULT_CATEGORY } = useParams();
  const { viewMode } = useApp();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(NEWS_CONFIG.DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentCategoryMeta =
    CATEGORIES.find((c) => c.id === category) || {
      id: category,
      label: category,
      description: "Curated real-time dispatches and analysis.",
    };

  // Reset and load fresh articles when category or sort changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPage(1);

    fetchNews({
      category,
      orderBy: sortBy,
      page: 1,
      pageSize: NEWS_CONFIG.PAGE_SIZE,
    })
      .then((data) => {
        if (!isMounted) return;
        setArticles(data.results || []);
        setTotalPages(data.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch news:", err);
        const isRateLimit =
          err.response?.status === 429 ||
          String(err.message).includes("429");

        const msg = isRateLimit
          ? "The Guardian API rate limit reached (1 request/second on developer tier). Please wait a few moments and try again."
          : err.message || "Failed to load articles.";

        setError(msg);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, sortBy]);

  // Load next page
  const handleLoadMore = () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    fetchNews({
      category,
      orderBy: sortBy,
      page: nextPage,
      pageSize: NEWS_CONFIG.PAGE_SIZE,
    })
      .then((data) => {
        setArticles((prev) => [...prev, ...(data.results || [])]);
        setPage(nextPage);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error("Failed to load more:", err);
        setLoadingMore(false);
      });
  };

  const leadStory = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <main className="min-h-screen py-6 sm:py-10 bg-surface">
      <div className={containerStyles}>
        {/* Section Masthead Header */}
        <header className="mb-8 sm:mb-12 border-b border-divider pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500">
                Desk Section
              </span>
            </div>
            <h1 className={editorialHeadingStyles}>{currentCategoryMeta.label}</h1>
            <p className="text-on-surface-muted text-sm sm:text-base mt-2 max-w-2xl">
              {currentCategoryMeta.description}
            </p>
          </div>

          {/* Sort Selector Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs font-mono text-on-surface-muted uppercase">
              Sort:
            </span>
            <div className="inline-flex rounded-xl bg-card border border-divider p-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    sortBy === opt.id
                      ? "bg-on-surface text-card shadow-sm"
                      : "text-on-surface-muted hover:text-on-surface"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Loading State with Shimmer Skeletons */}
        {loading && (
          <div>
            <SkeletonCard variant="hero" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error / Rate Limit State */}
        {!loading && error && (
          <div className="bg-card border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center my-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-2">
              Dispatch Unavailable
            </h3>
            <p className="text-on-surface-muted max-w-lg mx-auto text-sm sm:text-base mb-6">
              {error}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchNews({ category, orderBy: sortBy, page: 1 })
                  .then((data) => {
                    setArticles(data.results || []);
                    setLoading(false);
                  })
                  .catch((e) => {
                    setError(e.message || "Failed again");
                    setLoading(false);
                  });
              }}
              className="px-6 py-2.5 rounded-xl bg-on-surface text-card font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry Fetch</span>
            </button>
          </div>
        )}

        {/* Loaded Editorial Content */}
        {!loading && !error && articles.length > 0 && (
          <div>
            {/* When in Magazine View: Lead Hero Story + Grid */}
            {viewMode === "magazine" ? (
              <>
                {leadStory && <HeroCard article={leadStory} />}

                {remainingArticles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {remainingArticles.map((article) => (
                      <NewsCard
                        key={article.id || article.webUrl}
                        article={article}
                        layout="magazine"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* When in Digest View: Fast Scanning List */
              <div className="space-y-4">
                {articles.map((article) => (
                  <NewsCard
                    key={article.id || article.webUrl}
                    article={article}
                    layout="digest"
                  />
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {page < totalPages && (
              <div className="text-center mt-12 sm:mt-16">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3.5 rounded-2xl bg-card border border-divider hover:border-rose-500 font-semibold text-sm text-on-surface shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2.5 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving Stories...</span>
                    </>
                  ) : (
                    <>
                      <span>Load Next 18 Dispatches</span>
                      <span className="text-xs font-mono text-on-surface-muted">
                        (Page {page} of {totalPages})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="bg-card border border-divider rounded-3xl p-12 text-center my-8">
            <h3 className="font-serif text-2xl font-bold text-on-surface mb-2">
              No Dispatches Found
            </h3>
            <p className="text-on-surface-muted text-sm">
              No recent articles were found in this section.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
