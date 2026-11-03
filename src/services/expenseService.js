import api from "./api";

const expenseService = {
  getAllExpenses() {
    return api.get("/api/expenses");
  },

  addExpense(expenseData) {
    return api.post("/api/expenses", expenseData);
  },

  getExpenseById(id) {
    return api.get(`/api/expenses/${id}`);
  },

  updateExpense(id, expenseData) {
    return api.put(`/api/expenses/${id}`, expenseData);
  },

  deleteExpense(id) {
    return api.delete(`/api/expenses/${id}`);
  },
};

export default expenseService;