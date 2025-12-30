function SkeletonCard() {
  return (
    <div className="surface elevation-1 shape-lg overflow-hidden flex flex-col">
      {/* Image skeleton */}
      <div className="w-full h-40 sm:h-48 md:h-52 animate-shimmer"></div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col grow">
        {/* Title skeleton - 2 lines */}
        <div className="mb-2 sm:mb-3">
          <div className="h-5 sm:h-6 animate-shimmer rounded w-full mb-2"></div>
          <div className="h-5 sm:h-6 animate-shimmer rounded w-3/4"></div>
        </div>

        {/* Description skeleton - 3 lines */}
        <div className="mb-4 sm:mb-6 grow">
          <div className="h-4 animate-shimmer rounded w-full mb-2"></div>
          <div className="h-4 animate-shimmer rounded w-full mb-2"></div>
          <div className="h-4 animate-shimmer rounded w-2/3"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 sm:h-11 animate-shimmer shape-md"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
