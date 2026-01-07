import api from "./axios";

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (
  email: string,
  password: string,
  nickname: string
) =>
  api.post("/auth/register", { email, password, nickname });

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });
