import api from "./api";

const authService = {
 async register(details) {
    console.log("Auth API baseURL:", api.defaults.baseURL);

    console.log(
      "Resolved registration URL:",
      api.getUri({ url: "/api/auth/register" })
    );

    const response = await api.post("/api/auth/register", details);
    return response.data;
},

  async login(credentials) {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },
};

export default authService;
