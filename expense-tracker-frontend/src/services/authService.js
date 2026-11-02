import api from "./api";

const authService = {
  // POST /api/auth/register -> { id, name, email, message }
  async register({ name, email, password }) {
    const response = await api.post("/api/auth/register", { name, email, password });
    return response.data;
  },

  // POST /api/auth/login -> { id, name, email, token, tokenType }
  async login({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },
};

export default authService;
