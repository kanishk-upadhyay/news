/**
 * Decodes HTML entities and strips HTML tags from a string
 * @param {string} html - The HTML string to decode and clean
 * @returns {string} - The cleaned plain text
 */
export const decodeHTML = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value.replace(/<[^>]*>/g, "").trim();
};

/**
 * Removes duplicate prefix from description if it matches the title prefix or suffix
 * @param {string} title - The article title
 * @param {string} description - The article description
 * @returns {string} - The description without redundant prefix
 */
export const cleanDescription = (title, description) => {
  if (!title || !description) return description || "";

  // Extract prefix from title (everything before the first colon)
  const titlePrefixMatch = title.match(/^([^:]+):\s*/);

  if (titlePrefixMatch) {
    const prefix = titlePrefixMatch[0];
    if (description.startsWith(prefix)) {
      return description.slice(prefix.length).trim();
    }
  }

  // Extract category/section from title suffix (after pipe |)
  const titleSuffixMatch = title.match(/\|\s*([^|]+)\s*$/);

  if (titleSuffixMatch) {
    const suffix = titleSuffixMatch[1].trim();
    const suffixPattern = new RegExp(`^${suffix}:\\s*`, "i");
    if (suffixPattern.test(description)) {
      return description.replace(suffixPattern, "").trim();
    }
  }

  return description;
};

/**
 * Formats an ISO date into a human-friendly relative time string
 * e.g., "Just now", "15m ago", "3h ago", "Nov 5"
 * @param {string} dateString - ISO timestamp
 * @returns {string}
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * Calculates estimated read time from wordcount or text length
 * @param {number|string} wordCountOrText 
 * @returns {string} - e.g. "3 min read"
 */
export const calculateReadTime = (wordCountOrText) => {
  let words = 0;
  if (typeof wordCountOrText === "number") {
    words = wordCountOrText;
  } else if (typeof wordCountOrText === "string") {
    words = wordCountOrText.trim().split(/\s+/).length;
  }
  if (!words || words < 50) return "2 min read";
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};
