import api from "./axios";

export const getProfile = () => api.get("/profile/me");

export const updateProfile = (data: { displayName?: string; avatarUrl?: string }) =>
  api.patch("/profile/me", data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  api.put("/profile/me/password", data);

export const getMyFavorites = (page = 0, size = 4) =>
  api.get(`/profile/me/favorites?page=${page}&size=${size}`);

export const getMyWatched = (page = 0, size = 4) =>
  api.get(`/profile/me/watched?page=${page}&size=${size}`);

export const getMyWatchlist = (page = 0, size = 4) =>
  api.get(`/profile/me/watchlist?page=${page}&size=${size}`);