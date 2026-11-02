import api from "./api";

const dashboardService = {
  // GET /api/dashboard?year=&month=
  // -> { summary, categoryBreakdown, monthlyTrends, recentTransactions }
  async getDashboard(year, month) {
    const response = await api.get("/api/dashboard", { params: { year, month } });
    return response.data;
  },

  // GET /api/dashboard/monthly-trends?year=&month= -> last 6 months ending at the given month
  async getMonthlyTrends(year, month) {
    const response = await api.get("/api/dashboard/monthly-trends", {
      params: { year, month },
    });
    return response.data;
  },

  // GET /api/dashboard/category-breakdown?year=&month=
  async getCategoryBreakdown(year, month) {
    const response = await api.get("/api/dashboard/category-breakdown", {
      params: { year, month },
    });
    return response.data;
  },
};

export default dashboardService;
