import { decodeHTML, cleanDescription, formatRelativeTime, calculateReadTime } from "../utils/textUtils";
import { useApp } from "../context/useApp";

const FALLBACK_THUMBNAIL =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22225%22%20viewBox%3D%220%200%20400%20225%22%3E%3Crect%20fill%3D%22%23121927%22%20width%3D%22400%22%20height%3D%22225%22%20%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENewsHub%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function NewsCard({ article, layout = "magazine", onRemove = null }) {
  const { openReader, isBookmarked, toggleBookmark } = useApp();
  if (!article) return null;

  const title = decodeHTML(article.webTitle);
  const rawDescription = decodeHTML(article.fields?.trailText);
  const description = cleanDescription(title, rawDescription);
  const byline = article.fields?.byline;
  const timeAgo = formatRelativeTime(article.webPublicationDate);
  const readTime = calculateReadTime(article.fields?.wordcount || description);
  const bookmarked = isBookmarked(article);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(article);
    } else {
      toggleBookmark(article);
    }
  };

  // Compact Digest Row View
  if (layout === "digest") {
    return (
      <article className="group bg-card border border-divider rounded-2xl p-4 hover:border-rose-500/40 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-muted mb-1.5 flex-wrap">
            <span className="font-semibold uppercase tracking-wider text-rose-500">
              {article.sectionName}
            </span>
            <span>•</span>
            <span>{timeAgo}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          <h3
            onClick={() => openReader(article)}
            className="font-serif text-base sm:text-lg font-bold text-on-surface group-hover:text-rose-500 transition-colors cursor-pointer mb-1 line-clamp-2"
          >
            {title}
          </h3>

          <p className="text-on-surface-muted text-sm line-clamp-1 mb-2 text-pretty">
            {description}
          </p>

          <div className="text-xs text-on-surface-muted">
            {byline ? `By ${byline}` : "NewsHub Desk"}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {article.fields?.thumbnail && (
            <img
              src={article.fields.thumbnail}
              alt=""
              className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-xl border border-divider shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          )}

          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              bookmarked
                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                : "bg-card-subtle text-on-surface-muted hover:text-on-surface border-divider"
            }`}
            title={bookmarked ? "Remove Bookmark" : "Save for later"}
            aria-label="Bookmark article"
          >
            <svg
              className="w-4 h-4 transition-transform active:scale-125"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </article>
    );
  }

  // Standard Magazine Card View
  return (
    <article className="group bg-card border border-divider rounded-2xl overflow-hidden hover:shadow-xl hover:border-divider/90 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div
          onClick={() => openReader(article)}
          className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-card-subtle cursor-pointer"
        >
          <img
            src={article.fields?.thumbnail || FALLBACK_THUMBNAIL}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_THUMBNAIL) {
                e.currentTarget.src = FALLBACK_THUMBNAIL;
              }
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/75 backdrop-blur-sm text-white">
              {article.sectionName}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-muted mb-2">
            <span>{timeAgo}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>

          <h3
            onClick={() => openReader(article)}
            className="font-serif text-lg sm:text-xl font-bold text-on-surface group-hover:text-rose-500 transition-colors cursor-pointer mb-2.5 line-clamp-2 leading-snug"
          >
            {title}
          </h3>

          <p className="text-on-surface-muted text-sm line-clamp-3 leading-relaxed mb-4 text-pretty">
            {description || "Tap to read full summary and coverage."}
          </p>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-divider/60 flex items-center justify-between gap-3">
        <span className="text-xs text-on-surface-muted truncate">
          {byline ? `By ${byline}` : "NewsHub Desk"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              bookmarked
                ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                : "bg-card-subtle text-on-surface-muted hover:text-on-surface border-divider"
            }`}
            title={bookmarked ? "Remove Bookmark" : "Save for later"}
            aria-label="Bookmark article"
          >
            <svg
              className="w-3.5 h-3.5 transition-transform active:scale-125"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => openReader(article)}
            className="px-3 py-1.5 rounded-xl bg-card-subtle hover:bg-on-surface hover:text-card border border-divider text-xs font-semibold text-on-surface transition-all cursor-pointer"
          >
            Quick Read
          </button>
        </div>
      </div>
    </article>
  );
}
