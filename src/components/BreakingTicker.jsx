import { useState, useEffect } from "react";
import { BREAKING_TICKER_ITEMS } from "../constants";

export default function BreakingTicker({ items = BREAKING_TICKER_ITEMS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div
      role="region"
      aria-label="Breaking news updates"
      className="bg-slate-900 text-slate-100 dark:bg-black dark:text-slate-200 border-b border-slate-800 text-xs py-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Urgent Live Badge */}
        <div className="flex items-center gap-2 shrink-0 font-mono font-bold text-rose-500 uppercase tracking-widest text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Breaking
        </div>

        {/* Current Active Headline */}
        <div className="flex-1 min-w-0 flex items-center gap-3 overflow-hidden">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            {currentItem.tag}
          </span>
          <span className="truncate text-xs font-medium text-slate-200 hover:text-white transition-colors">
            {currentItem.text}
          </span>
        </div>

        {/* Navigation & Counter Controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-slate-400">
          <span className="hidden sm:inline-block">
            {currentIndex + 1} / {items.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous headline"
              title="Previous headline"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next headline"
              title="Next headline"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
