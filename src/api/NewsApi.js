import axios from "axios";
import { NEWS_CONFIG } from "../constants";

const API_KEY =
  import.meta.env.VITE_GUARDIAN_API_KEY ||
  "91c7970b-ef3f-4a1a-a39b-d35bc24fd4d5";

const memoryCache = new Map();

/**
 * Generates a consistent cache key for query requests
 */
const getCacheKey = (category, query, orderBy, page) => {
  return `news_${category || "all"}_${query || ""}_${orderBy || "newest"}_${page || 1}`;
};

/**
 * Retrieves item from memory or sessionStorage
 */
const getCachedData = (key) => {
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.timestamp < NEWS_CONFIG.CACHE_TTL_MS) {
    return mem.data;
  }

  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < NEWS_CONFIG.CACHE_TTL_MS) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch {
    // SessionStorage may fail in restricted privacy modes
  }
  return null;
};

/**
 * Saves item to memory and sessionStorage
 */
const setCachedData = (key, data) => {
  const payload = { timestamp: Date.now(), data };
  memoryCache.set(key, payload);
  try {
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Quota exceeded or private browsing
  }
};

/**
 * Fetches news articles from The Guardian Open Platform
 * Supports categories, search queries, pagination, and sorting
 *
 * @param {Object} options
 * @param {string} [options.category]
 * @param {string} [options.query]
 * @param {string} [options.orderBy] - 'newest' | 'relevance' | 'oldest'
 * @param {number} [options.page]
 * @param {number} [options.pageSize]
 * @returns {Promise<{ results: Array, total: number, pages: number, currentPage: number }>}
 */
export const fetchNews = async ({
  category = NEWS_CONFIG.DEFAULT_CATEGORY,
  query = "",
  orderBy = NEWS_CONFIG.DEFAULT_SORT,
  page = 1,
  pageSize = NEWS_CONFIG.PAGE_SIZE,
} = {}) => {
  const cacheKey = getCacheKey(category, query, orderBy, page);
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  const url = "https://content.guardianapis.com/search";

  const params = {
    "show-fields": "thumbnail,trailText,byline,wordcount,bodyText,publication,shortUrl",
    "page-size": pageSize,
    page: page,
    "order-by": orderBy,
    "api-key": API_KEY,
  };

  if (category && category !== "all") {
    params.section = category;
  }

  if (query && query.trim().length > 0) {
    params.q = query.trim();
  }

  try {
    const response = await axios.get(url, { params, timeout: 10000 });
    const res = response.data?.response;

    const payload = {
      results: res?.results || [],
      total: res?.total || 0,
      pages: res?.pages || 1,
      currentPage: res?.currentPage || page,
    };

    setCachedData(cacheKey, payload);
    return payload;
  } catch (err) {
    // Fallback: If network error or 429 rate limit, check if any stale cache exists
    const stale = memoryCache.get(cacheKey);
    if (stale?.data) {
      return stale.data;
    }
    throw err;
  }
};
