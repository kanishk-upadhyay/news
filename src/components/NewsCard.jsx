import { decodeHTML, cleanDescription } from "../utils/textUtils";

const FALLBACK_THUMBNAIL =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22200%22%20viewBox%3D%220%200%20400%20200%22%3E%3Crect%20fill%3D%22%232a2238%22%20width%3D%22400%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%23a29bfe%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2222%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENewsHub%3C%2Ftext%3E%3C%2Fsvg%3E";

function NewsCard({ article }) {
  const title = decodeHTML(article.webTitle);
  const rawDescription = decodeHTML(article.fields?.trailText);
  const description = cleanDescription(title, rawDescription);

  return (
    <div className="surface elevation-1 hover:elevation-3 shape-lg overflow-hidden transition-all flex flex-col">
      <img
        src={article.fields?.thumbnail || FALLBACK_THUMBNAIL}
        alt={title}
        className="w-full h-40 sm:h-48 md:h-52 object-cover"
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK_THUMBNAIL) {
            e.currentTarget.src = FALLBACK_THUMBNAIL;
          }
        }}
      />
      <div className="p-4 sm:p-5 md:p-6 flex flex-col grow">
        <h2 className="text-lg sm:text-xl font-bold on-surface mb-2 sm:mb-3 line-clamp-2">
          {title}
        </h2>
        <p className="on-surface-variant text-sm mb-4 sm:mb-6 line-clamp-3 grow">
          {description || "No description available"}
        </p>
        <a
          href={article.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary shape-md px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-center hover:elevation-2 transition-all"
        >
          Read Article
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
