
import api from "./api";

const analyticsService = {
  getCategoryBreakdown(year, month) {
    return api.get("/api/dashboard/category-breakdown", {
      params: { year, month },
    });
  },

  getMonthlyTrends(year, month) {
    return api.get("/api/dashboard/monthly-trends", {
      params: { year, month },
    });
  },
};

export default analyticsService;
