export const CATEGORIES = [
  { id: "world", label: "World", description: "Global geopolitical developments and international affairs" },
  { id: "technology", label: "Technology", description: "Artificial intelligence, computing, cyberspace & innovations" },
  { id: "business", label: "Business", description: "Global markets, finance, trade, and economic trends" },
  { id: "science", label: "Science", description: "Space exploration, discoveries, physics, and bio-research" },
  { id: "environment", label: "Environment", description: "Climate policy, biodiversity, and clean energy transitions" },
  { id: "politics", label: "Politics", description: "Legislative debates, diplomacy, and governance" },
  { id: "culture", label: "Culture", description: "Literature, cinema, modern arts, and social discourse" },
  { id: "sport", label: "Sport", description: "Championships, athletics, global football, and motorsport" },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export const SORT_OPTIONS = [
  { id: "newest", label: "Latest" },
  { id: "relevance", label: "Top Stories" },
  { id: "oldest", label: "Oldest" },
];

export const NEWS_CONFIG = {
  PAGE_SIZE: 18,
  DEFAULT_CATEGORY: "world",
  DEFAULT_SORT: "newest",
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes cache
};

export const BREAKING_TICKER_ITEMS = [
  { text: "GLOBAL SUMMIT: UN climate panel calls for accelerated carbon capture timelines", tag: "CLIMATE" },
  { text: "AI SAFETY: Next-generation reasoning architectures benchmarked across global labs", tag: "TECH" },
  { text: "MARKETS: Semiconductor indexes touch record volume on supply chain resilience reports", tag: "FINANCE" },
  { text: "SPACE: Deep-space telemetry confirms water-ice reservoirs on lunar south pole", tag: "SPACE" },
  { text: "BIOTECH: Targeted peptide therapeutics demonstrate 82% efficacy in clinical trial", tag: "SCIENCE" },
];
