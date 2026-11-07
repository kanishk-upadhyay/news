import { BREAKING_TICKER_ITEMS } from "../constants";

export default function BreakingTicker({ items = BREAKING_TICKER_ITEMS }) {
  // Duplicate items for continuous seamless marquee loop
  const displayItems = [...items, ...items];

  return (
    <div className="bg-slate-900 text-slate-100 dark:bg-black dark:text-slate-200 border-b border-slate-800 text-xs py-2 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        {/* Urgent Live Badge */}
        <div className="flex items-center gap-2 pr-4 bg-slate-900 dark:bg-black z-10 shrink-0 font-mono font-bold text-rose-500 uppercase tracking-widest text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Breaking
        </div>

        {/* Marquee Track */}
        <div className="overflow-hidden whitespace-nowrap mask-gradient flex-1 relative">
          <div className="animate-marquee flex items-center gap-8 text-xs font-medium">
            {displayItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-default">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.tag}
                </span>
                <span>{item.text}</span>
                <span className="text-slate-600 mx-2">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
