import api from "./axios";

export interface MovieCardResponse {
  id: number;
  title: string;
  releaseDate: string | null;
  rating: number | null;
  photoUrl: string | null;
}

export const getMovies = (page = 0, size = 20) =>
  api.get("/movies", { params: { page, size } });

// Деталка (у бекенді є і /api/movies/{id}, і /api/movies/{id}/details)
export const getMovieDetails = (id: number) => api.get(`/movies/${id}/details`);
