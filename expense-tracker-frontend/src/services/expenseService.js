import api from "./api";

// Build the exact ExpenseRequest body the backend expects.
function toPayload(values) {
  return {
    amount: Number(values.amount),
    category: String(values.category).trim(),
    description: values.description?.trim() || null,
    expenseDate: values.expenseDate, // "YYYY-MM-DD"
    paymentMethod: values.paymentMethod?.trim() || null,
  };
}

const expenseService = {
  // GET /api/expenses -> ExpenseResponse[] (newest first, current user only)
  async list() {
    const response = await api.get("/api/expenses");
    return response.data;
  },

  // POST /api/expenses -> 201 ExpenseResponse
  async create(values) {
    const response = await api.post("/api/expenses", toPayload(values));
    return response.data;
  },

  // PUT /api/expenses/{id} -> ExpenseResponse
  async update(id, values) {
    const response = await api.put(`/api/expenses/${id}`, toPayload(values));
    return response.data;
  },

  // DELETE /api/expenses/{id} -> 204
  async remove(id) {
    await api.delete(`/api/expenses/${id}`);
  },
};

export default expenseService;
