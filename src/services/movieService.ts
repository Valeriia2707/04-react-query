import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovie = async (query: string, page: number): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json",
      },
    }
  );

  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
    total_results: response.data.total_results
  };
};

