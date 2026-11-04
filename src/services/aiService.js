
import api from "./api";

const aiService = {
  async parseExpense(text) {
    const response = await api.post("/api/ai/parse-expense", {
      text,
    });

    return response.data;
  },
};

export default aiService;
