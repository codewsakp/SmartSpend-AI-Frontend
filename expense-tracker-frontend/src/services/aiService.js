import api from "./api";

/*
 * AI INTEGRATION INTERFACE  (backend support: NOT AVAILABLE YET)
 *
 * The backend you provided has no AI endpoints. The paths below are PROPOSED
 * contracts for the Spring AI + Ollama work, not existing APIs. Nothing here
 * talks to Ollama: React only ever calls the Spring Boot backend.
 *
 * Until the backend implements them, keep VITE_AI_ENABLED=false (the default)
 * and the UI shows AI features as "not connected" instead of faking results.
 * See BACKEND_API_REFERENCE.md for the request/response shapes.
 */

export const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === "true";

export const AI_ENDPOINTS = {
  parseExpense: "/api/ai/expenses/parse", // POST { text }
  suggestCategory: "/api/ai/expenses/categorize", // POST { description }
  ask: "/api/ai/insights/ask", // POST { question, year, month }
  monthlySummary: "/api/ai/insights/monthly-summary", // GET ?year=&month=
};

export class AiUnavailableError extends Error {
  constructor() {
    super("AI features are not connected to the backend yet.");
    this.name = "AiUnavailableError";
  }
}

function assertEnabled() {
  if (!AI_ENABLED) throw new AiUnavailableError();
}

// Local models can be slow, so AI calls get a longer timeout than normal ones.
const AI_TIMEOUT = 60000;

const aiService = {
  // Expected response: { amount, category, description, expenseDate, paymentMethod }
  // Values may be null when the text did not contain them. NOTHING is saved
  // here; the caller must show a preview and save through expenseService.
  async parseExpense(text) {
    assertEnabled();
    const response = await api.post(AI_ENDPOINTS.parseExpense, { text }, { timeout: AI_TIMEOUT });
    return response.data;
  },

  // Expected response: { category: string }
  async suggestCategory(description) {
    assertEnabled();
    const response = await api.post(
      AI_ENDPOINTS.suggestCategory,
      { description },
      { timeout: AI_TIMEOUT }
    );
    return response.data;
  },

  // Expected response: { answer: string }
  // The backend must compute all figures itself; the model only explains them.
  async ask(question, year, month) {
    assertEnabled();
    const response = await api.post(
      AI_ENDPOINTS.ask,
      { question, year, month },
      { timeout: AI_TIMEOUT }
    );
    return response.data;
  },

  // Expected response: { summary: string }
  async monthlySummary(year, month) {
    assertEnabled();
    const response = await api.get(AI_ENDPOINTS.monthlySummary, {
      params: { year, month },
      timeout: AI_TIMEOUT,
    });
    return response.data;
  },
};

export default aiService;
