import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchNews } from "../api/NewsApi";
import NewsCard from "../components/NewsCard";
import LoadingMessage from "../components/LoadingMessage";
import { NEWS_CONFIG } from "../constants";
import {
  containerStyles,
  cardGridStyles,
  headingStyles,
  subheadingStyles,
  emptyStateStyles,
  emptyStateTextStyles,
} from "../utils/styles";

function NewsFeed() {
  const { category = NEWS_CONFIG.DEFAULT_CATEGORY } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchNews(category)
      .then((data) => {
        if (isMounted) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Failed to fetch news:", error);
          setError(error.message || "Failed to load articles");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return (
    <div className="surface min-h-screen py-4 sm:py-6 lg:py-8">
      <div className={containerStyles}>
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className={headingStyles}>{category}</h1>
          <p className={subheadingStyles}>Latest news</p>
        </div>

        {loading && <LoadingMessage />}

        {error && (
          <div className={emptyStateStyles}>
            <p className={emptyStateTextStyles}>Error: {error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          (articles.length > 0 ? (
            <div className={cardGridStyles}>
              {articles.map((article, index) => (
                <NewsCard key={index} article={article} />
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
