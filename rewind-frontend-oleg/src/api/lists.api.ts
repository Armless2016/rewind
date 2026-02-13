import api from "./axios";

export const getUserLists = () => api.get("/lists/my");

export const getListItems = (listId: number) => api.get(`/lists/${listId}/items`);

export const createList = (payload: {
  name: string;
  description?: string;
  isPublic?: boolean;
}) => api.post("/lists", payload);

export const updateList = (
  listId: number,
  payload: { name?: string; description?: string; isPublic?: boolean }
) => api.patch(`/lists/${listId}`, payload);

export const addMovieToList = (listId: number, movieId: number, position?: number) =>
  api.post(`/lists/${listId}/items`, { movieId, position });

export const removeMovieFromList = (listId: number, movieId: number) =>
  api.delete(`/lists/${listId}/items/${movieId}`);
