
import api from "./api";

const budgetService = {
  updateBudget(budgetData) {
    return api.put("/api/budgets", budgetData);
  },

  getBudgetSummary(year, month) {
    return api.get("/api/budgets/summary", {
      params: { year, month },
    });
  },
};

export default budgetService;
