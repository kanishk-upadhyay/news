import axios from "axios";
import { NEWS_CONFIG } from "../constants";

const API_KEY = "test";

export const fetchNews = (category) => {
  const url = "https://content.guardianapis.com/search";

  return axios
    .get(url, {
      params: {
        section: category,
        "show-fields": "thumbnail,trailText",
        "page-size": NEWS_CONFIG.PAGE_SIZE,
        "api-key": API_KEY,
      },
    })
    .then((response) => response.data.response.results);
};
