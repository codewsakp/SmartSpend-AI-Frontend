import api from "./api";

const budgetService = {
  // PUT /api/budgets  { amount, year, month } -> BudgetResponse
  // Creates the budget for that month, or updates it if it already exists.
  async set({ amount, year, month }) {
    const response = await api.put("/api/budgets", {
      amount: Number(amount),
      year,
      month,
    });
    return response.data;
  },

  // GET /api/budgets/summary?year=&month= -> BudgetSummaryResponse
  // The backend answers 404 when no budget exists for the month; that is a
  // normal state, so it is returned as null instead of an error.
  async getSummary(year, month) {
    try {
      const response = await api.get("/api/budgets/summary", {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },
};

export default budgetService;
