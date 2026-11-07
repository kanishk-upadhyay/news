export default function SkeletonCard({ variant = "card" }) {
  if (variant === "hero") {
    return (
      <div className="bg-card border border-divider rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 mb-8 sm:mb-12 shadow-sm">
        <div className="lg:col-span-7 h-64 sm:h-80 lg:h-96 animate-shimmer"></div>
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-24 h-5 rounded-full animate-shimmer mb-4"></div>
            <div className="w-full h-8 rounded-lg animate-shimmer mb-3"></div>
            <div className="w-3/4 h-8 rounded-lg animate-shimmer mb-6"></div>
            <div className="w-full h-4 rounded animate-shimmer mb-2"></div>
            <div className="w-5/6 h-4 rounded animate-shimmer mb-2"></div>
            <div className="w-2/3 h-4 rounded animate-shimmer mb-6"></div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-divider">
            <div className="w-32 h-4 rounded animate-shimmer"></div>
            <div className="w-20 h-8 rounded-xl animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-divider rounded-2xl overflow-hidden flex flex-col shadow-sm">
      <div className="w-full h-44 sm:h-52 animate-shimmer"></div>
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-20 h-4 rounded-full animate-shimmer"></div>
            <div className="w-16 h-3 rounded animate-shimmer"></div>
          </div>
          <div className="w-full h-5 rounded animate-shimmer mb-2"></div>
          <div className="w-4/5 h-5 rounded animate-shimmer mb-4"></div>
          <div className="w-full h-3.5 rounded animate-shimmer mb-2"></div>
          <div className="w-2/3 h-3.5 rounded animate-shimmer mb-4"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-divider/60">
          <div className="w-20 h-3 rounded animate-shimmer"></div>
          <div className="w-8 h-8 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
