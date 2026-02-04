import api from "./axios";

export const searchMovies = (query: string) =>
  api.get("/movies/search", { params: { q: query } });
