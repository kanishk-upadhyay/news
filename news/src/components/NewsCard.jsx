function NewsCard({ article }) {
  return (
    <div className="surface elevation-1 hover:elevation-3 shape-lg overflow-hidden transition-all duration-300 flex flex-col">
      <img
        src={article.fields?.thumbnail || "https://via.placeholder.com/400x200"}
        alt={article.webTitle}
        className="w-full h-52 object-cover"
      />
      <div className="p-6 flex flex-col grow">
        <h2 className="text-xl font-bold on-surface mb-3 line-clamp-2">
          {article.webTitle}
        </h2>
        <p className="on-surface-variant text-sm mb-6 line-clamp-3 grow">
          {article.fields?.trailText || "No description available"}
        </p>
        <a
          href={article.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary shape-md px-6 py-3 font-semibold text-center hover:elevation-2 transition-all duration-200 inline-block"
        >
          Read Article
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
