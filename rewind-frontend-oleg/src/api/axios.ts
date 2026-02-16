import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173/api",
});

function readToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
