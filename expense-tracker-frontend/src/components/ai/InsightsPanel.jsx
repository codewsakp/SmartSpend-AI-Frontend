import { useState } from "react";
import { Lightbulb, LoaderCircle, Send, Sparkles } from "lucide-react";
import Alert from "../common/Alert";
import { getApiErrorMessage } from "../../services/api";
import aiService, { AI_ENABLED } from "../../services/aiService";
import { formatCurrency, formatPercent } from "../../utils/format";

const QUESTIONS = [
  "Where am I spending the most?",
  "Where can I save money?",
  "Which category has the highest spending?",
  "Am I exceeding my monthly budget?",
];

// Plain statements built only from numbers the backend already calculated.
// This is NOT AI output and is labelled as such in the UI.
function buildHighlights({ summary, categories, trends }) {
  const highlights = [];

  if (categories.length > 0) {
    const top = categories[0];
    highlights.push(
      `${top.category} is your biggest category: ${formatCurrency(top.totalAmount)} (${formatPercent(top.percentage)} of this month's spending).`
    );
  }

  if (summary.budgetStatus === "OVER_BUDGET") {
    highlights.push(
      `You are ${formatCurrency(Math.abs(Number(summary.remainingBudget)))} over this month's budget.`
    );
  } else if (summary.budgetStatus === "WITHIN_BUDGET") {
    highlights.push(
      `You have used ${formatPercent(summary.percentageUsed)} of your budget, with ${formatCurrency(summary.remainingBudget)} left.`
    );
  } else {
    highlights.push("No budget is set for this month, so budget insights are unavailable.");
  }

  if (trends.length >= 2) {
    const current = Number(trends[trends.length - 1].totalAmount);
    const previous = Number(trends[trends.length - 2].totalAmount);
    if (previous > 0) {
      const change = ((current - previous) / previous) * 100;
      const direction = change >= 0 ? "more" : "less";
      highlights.push(
        `You spent ${formatPercent(Math.abs(change))} ${direction} than in ${trends[trends.length - 2].month}.`
      );
    }
  }

  return highlights;
}

export default function InsightsPanel({ summary, categories, trends, year, month }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const highlights = buildHighlights({ summary, categories, trends });
  const hasData = categories.length > 0;

  async function run(action) {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const result = await action();
      setAnswer(result?.answer ?? result?.summary ?? "");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function ask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    run(() => aiService.ask(trimmed, year, month));
  }

  return (
    <div className="insights">
      <div className="insights-column">
        <h3 className="subheading">
          <Lightbulb size={16} aria-hidden="true" /> Highlights
          <span className="badge badge-neutral">From your data</span>
        </h3>
        {hasData || summary.budgetStatus !== "BUDGET_NOT_SET" ? (
          <ul className="highlight-list">
            {highlights.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Add some expenses this month to see highlights.</p>
        )}
      </div>

      <div className="insights-column">
        <h3 className="subheading">
          <Sparkles size={16} aria-hidden="true" /> Ask AI
          {AI_ENABLED ? null : <span className="badge badge-neutral">Not connected</span>}
        </h3>

        <div className="chip-row">
          {QUESTIONS.map((text) => (
            <button
              key={text}
              type="button"
              className="chip"
              disabled={!AI_ENABLED || loading}
              onClick={() => ask(text)}
            >
              {text}
            </button>
          ))}
        </div>

        <form
          className="ai-entry-row"
          onSubmit={(event) => {
            event.preventDefault();
            ask(question);
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about your spending…"
            aria-label="Ask a question about your spending"
            disabled={!AI_ENABLED || loading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-icon"
            aria-label="Send question"
            disabled={!AI_ENABLED || loading || !question.trim()}
          >
            {loading ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />}
          </button>
        </form>

        {AI_ENABLED ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={loading}
            onClick={() => run(() => aiService.monthlySummary(year, month))}
          >
            <Sparkles size={14} /> Summarise this month
          </button>
        ) : (
          <p className="field-hint">
            AI answers need the Spring AI + Ollama endpoints on the backend, which are not available yet.
          </p>
        )}

        {error ? <Alert type="error">{error}</Alert> : null}
        {answer ? <div className="ai-answer">{answer}</div> : null}
      </div>
    </div>
  );
}
