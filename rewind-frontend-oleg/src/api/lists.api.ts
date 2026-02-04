import api from "./axios";

export const getUserLists = () => api.get("/lists/my");

export const createList = (name: string) =>
  api.post("/lists", { name });

export const addMovieToList = (listId: number, movieId: number, position?: number) =>
  api.post(`/lists/${listId}/items`, { movieId, position });

export const removeMovieFromList = (listId: number, movieId: number) =>
  api.delete(`/lists/${listId}/items/${movieId}`);
