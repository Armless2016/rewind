import api from "./axios";

export const getMovieDetails = (id: number) => api.get(`/movies/${id}/details`);
