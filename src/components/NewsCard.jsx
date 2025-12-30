import { decodeHTML, cleanDescription } from "../utils/textUtils";

function NewsCard({ article }) {
  const title = decodeHTML(article.webTitle);
  const rawDescription = decodeHTML(article.fields?.trailText);
  const description = cleanDescription(title, rawDescription);

  return (
    <div className="surface elevation-1 hover:elevation-3 shape-lg overflow-hidden transition-all flex flex-col">
      <img
        src={article.fields?.thumbnail || "https://via.placeholder.com/400x200"}
        alt={title}
        className="w-full h-40 sm:h-48 md:h-52 object-cover"
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
