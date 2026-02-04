import api from "./axios";

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (email: string, password: string, username: string) =>
  api.post("/auth/register", { email, password, username });

// Скидання паролю зараз не підтримується в бекенді.
// Залишаємо заглушку, щоб нічого не падало у фронті, якщо десь викликається.
export const forgotPassword = async (_email: string) => {
  throw new Error("Password reset is not implemented yet");
};
