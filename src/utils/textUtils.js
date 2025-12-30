/**
 * Decodes HTML entities and strips HTML tags from a string
 * @param {string} html - The HTML string to decode and clean
 * @returns {string} - The cleaned plain text
 */
export const decodeHTML = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value.replace(/<[^>]*>/g, "");
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
    // If description starts with the same prefix, remove it
    if (description.startsWith(prefix)) {
      return description.slice(prefix.length).trim();
    }
  }

  // Extract category/section from title suffix (after pipe |)
  const titleSuffixMatch = title.match(/\|\s*([^|]+)\s*$/);

  if (titleSuffixMatch) {
    const suffix = titleSuffixMatch[1].trim();
    const suffixPattern = new RegExp(`^${suffix}:\\s*`, "i");
    // If description starts with the category word followed by colon, remove it
    if (suffixPattern.test(description)) {
      return description.replace(suffixPattern, "").trim();
    }
  }

  return description;
};
