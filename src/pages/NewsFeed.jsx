import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchNews } from "../api/NewsApi";
import NewsCard from "../components/NewsCard";
import SkeletonCard from "../components/SkeletonCard";
import { NEWS_CONFIG } from "../constants";
import {
  containerStyles,
  cardGridStyles,
  headingStyles,
  emptyStateStyles,
  emptyStateTextStyles,
} from "../utils/styles";

function NewsFeed() {
  const { category = NEWS_CONFIG.DEFAULT_CATEGORY } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategoryNews = () => {
    setLoading(true);
    setError(null);

    fetchNews(category)
      .then((data) => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        const isRateLimit =
          err.response?.status === 429 ||
          String(err.message).includes("429");

        const msg = isRateLimit
          ? "The Guardian test API rate limit was reached (1 request/second). Please wait a moment."
          : err.message || "Failed to load articles";

        setError(msg);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategoryNews();
  }, [category]);

  return (
    <div className="surface min-h-screen py-4 sm:py-6 lg:py-8">
      <div className={containerStyles}>
        <h1 className={headingStyles}>{category}</h1>

        {loading && (
          <div className={cardGridStyles}>
            {[...Array(9)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className={emptyStateStyles}>
            <p className={emptyStateTextStyles}>{error}</p>
            <button
              type="button"
              onClick={loadCategoryNews}
              className="mt-4 px-5 py-2.5 primary shape-md font-semibold text-sm hover:elevation-2 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          (articles.length > 0 ? (
            <div className={cardGridStyles}>
              {articles.map((article, index) => (
                <NewsCard key={article.id || index} article={article} />
              ))}
            </div>
          ) : (
            <div className={emptyStateStyles}>
              <p className={emptyStateTextStyles}>No articles found</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default NewsFeed;
