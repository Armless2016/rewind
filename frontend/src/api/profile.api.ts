import api from "./axios";

export const getProfile = () => api.get("/users/me");

export const updateProfile = (data: { nickname?: string; password?: string }) =>
  api.put("/users/me", data);
