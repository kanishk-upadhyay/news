import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/useApp";
import { decodeHTML, cleanDescription, formatRelativeTime, calculateReadTime } from "../utils/textUtils";

export default function ReaderDrawer() {
  const { activeArticle, closeReader, isBookmarked, toggleBookmark } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // 'normal' | 'large' | 'xl'
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  // Stop speech when component unmounts or activeArticle closes
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeArticle]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeArticle) {
        closeReader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeArticle, closeReader]);

  // Track scroll progress
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      setScrollProgress(Math.min(100, Math.round((scrollTop / total) * 100)));
    }
  };

  if (!activeArticle) return null;

  const title = decodeHTML(activeArticle.webTitle);
  const rawDescription = decodeHTML(activeArticle.fields?.trailText);
  const description = cleanDescription(title, rawDescription);
  const byline = activeArticle.fields?.byline;
  const timeAgo = formatRelativeTime(activeArticle.webPublicationDate);
  const readTime = calculateReadTime(activeArticle.fields?.wordcount || description);
  const bookmarked = isBookmarked(activeArticle);

  // Native Web Speech API Text-to-Speech
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${title}. ${description}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: activeArticle.webUrl,
        });
        return;
      } catch {
        // User cancelled
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(activeArticle.webUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontSizeClasses = {
    normal: "text-base sm:text-lg leading-relaxed sm:leading-8",
    large: "text-lg sm:text-xl leading-relaxed sm:leading-9",
    xl: "text-xl sm:text-2xl leading-loose",
  }[fontSize];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/75 backdrop-blur-md transition-all animate-in fade-in duration-200"
      onClick={closeReader}
    >
      <div
        className="w-full max-w-3xl bg-card border border-divider rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reading Progress Line */}
        <div
          className="h-1 bg-rose-500 transition-all duration-150 absolute top-0 left-0 z-20"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Centered Reader Header Bar */}
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between gap-4 bg-card-subtle/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {activeArticle.sectionName}
            </span>
            <span className="text-xs text-on-surface-muted font-mono">• {readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Selector */}
            <div className="flex items-center rounded-xl border border-divider bg-card p-0.5">
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                  fontSize === "normal"
                    ? "bg-on-surface text-card shadow-sm"
                    : "text-on-surface-muted hover:text-on-surface"
                }`}
                title="Normal Reading Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                className={`px-2.5 py-1 text-sm rounded-lg font-semibold cursor-pointer ${
                  fontSize === "large"
                    ? "bg-on-surface text-card shadow-sm"
                    : "text-on-surface-muted hover:text-on-surface"
                }`}
                title="Large Reading Size"
              >
                A+
              </button>
            </div>

            {/* Audio Listen */}
            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isPlayingAudio
                  ? "bg-rose-500 text-white border-rose-500 animate-pulse"
                  : "bg-card border-divider text-on-surface-muted hover:text-on-surface"
              }`}
              title={isPlayingAudio ? "Stop Audio" : "Listen (Text-to-Speech)"}
              aria-label="Listen to article"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isPlayingAudio ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>

            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(activeArticle);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                bookmarked
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-card border-divider text-on-surface-muted hover:text-on-surface"
              }`}
              title={bookmarked ? "Remove Bookmark" : "Save story"}
            >
              <svg
                className="w-3.5 h-3.5"
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>

            {/* Share / Copy */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-divider bg-card text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
              title="Share Article"
            >
              {copied ? (
                <span className="text-xs text-rose-500 font-mono font-bold">✓</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={closeReader}
              className="p-2 rounded-xl hover:bg-card-subtle text-on-surface-muted hover:text-on-surface transition-all cursor-pointer"
              aria-label="Close reader"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Centered Article Reading Room */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-10"
        >
          <div className="max-w-2xl mx-auto">
            {/* Metadata Line */}
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-muted mb-3">
              <span>Published {timeAgo}</span>
              {byline && (
                <>
                  <span>•</span>
                  <span>By <strong className="text-on-surface font-semibold">{byline}</strong></span>
                </>
              )}
            </div>

            {/* Journalistic Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
              {title}
            </h1>

            {/* High-Res Hero Thumbnail */}
            {activeArticle.fields?.thumbnail && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-divider shadow-sm bg-card-subtle">
                <img
                  src={activeArticle.fields.thumbnail}
                  alt={title}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {/* Lead Excerpt with Journalistic Drop-Cap */}
            <div className={`font-sans text-on-surface ${fontSizeClasses} mb-8 space-y-5`}>
              <p className="editorial-drop-cap font-medium text-on-surface text-lg sm:text-xl leading-relaxed text-pretty">
                {description}
              </p>

              {activeArticle.fields?.bodyText ? (
                <div className="space-y-5 pt-6 border-t border-divider text-on-surface-muted font-sans text-base sm:text-lg leading-relaxed">
                  {activeArticle.fields.bodyText.split("\n\n").map((para, idx) => (
                    <p key={idx} className="text-on-surface/90 text-pretty">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-muted font-sans text-sm italic pt-4 border-t border-divider">
                  For the full investigative report, comprehensive multimedia, and community commentary, view the original publication below.
                </p>
              )}
            </div>

            {/* Editorial Attribution & Outbound Banner */}
            <div className="mt-10 p-6 rounded-2xl bg-card-subtle border border-divider text-center">
              <h4 className="font-serif text-lg font-bold text-on-surface mb-2">
                Continue reading at The Guardian
              </h4>
              <p className="text-xs text-on-surface-muted mb-4 max-w-md mx-auto">
                Access interactive data visualizations, photojournalism essays, and live community discussions.
              </p>
              <a
                href={activeArticle.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-on-surface text-card font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <span>Open on theguardian.com</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
