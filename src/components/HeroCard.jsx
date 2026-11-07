import { decodeHTML, cleanDescription, formatRelativeTime, calculateReadTime } from "../utils/textUtils";
import { useApp } from "../context/useApp";

const FALLBACK_THUMBNAIL =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20fill%3D%22%23121927%22%20width%3D%22800%22%20height%3D%22450%22%2F%3E%3Ctext%20fill%3D%22%23e11d48%22%20font-family%3D%22Georgia%2C%20serif%22%20font-size%3D%2236%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENewsHub%20Lead%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function HeroCard({ article }) {
  const { openReader, isBookmarked, toggleBookmark } = useApp();
  if (!article) return null;

  const title = decodeHTML(article.webTitle);
  const rawDescription = decodeHTML(article.fields?.trailText);
  const description = cleanDescription(title, rawDescription);
  const byline = article.fields?.byline;
  const timeAgo = formatRelativeTime(article.webPublicationDate);
  const readTime = calculateReadTime(article.fields?.wordcount || description);
  const bookmarked = isBookmarked(article.id || article.webUrl);

  return (
    <section className="group relative bg-card border border-divider rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-8 sm:mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual Cover */}
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[320px] overflow-hidden bg-card-subtle">
          <img
            src={article.fields?.thumbnail || FALLBACK_THUMBNAIL}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_THUMBNAIL) {
                e.currentTarget.src = FALLBACK_THUMBNAIL;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:hidden pointer-events-none" />

          {/* Lead Story Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Lead Story
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Meta tags: Section + Time + Read duration */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-on-surface-muted mb-3 flex-wrap">
              <span className="font-semibold uppercase tracking-wider text-rose-500">
                {article.sectionName}
              </span>
              <span>•</span>
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>

            {/* Headline */}
            <h2
              onClick={() => openReader(article)}
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface hover:text-rose-500 transition-colors cursor-pointer mb-3 leading-tight"
            >
              {title}
            </h2>

            {/* Summary Excerpt */}
            <p className="text-on-surface-muted text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
              {description || "Explore comprehensive coverage and on-the-ground reporting for this top global development."}
            </p>
          </div>

          {/* Byline & Interactive Actions */}
          <div className="pt-4 border-t border-divider flex items-center justify-between gap-4">
            <div className="text-xs text-on-surface-muted truncate">
              {byline ? (
                <span>By <strong className="text-on-surface font-medium">{byline}</strong></span>
              ) : (
                <span>NewsHub Wire Desk</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(article)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  bookmarked
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-card-subtle text-on-surface-muted hover:text-on-surface border-divider"
                }`}
                title={bookmarked ? "Remove Bookmark" : "Save for later"}
                aria-label="Bookmark article"
              >
                <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              {/* Quick Read Drawer Trigger */}
              <button
                onClick={() => openReader(article)}
                className="px-4 py-2.5 rounded-xl bg-on-surface text-card font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
              >
                <span>Read Story</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
