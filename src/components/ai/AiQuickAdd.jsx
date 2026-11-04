
import { useState } from "react";
import { Sparkles, Send, CheckCircle, X, LoaderCircle } from "lucide-react";

import aiService from "../../services/aiService";
import expenseService from "../../services/expenseService";
import { getApiErrorMessage } from "../../services/api";

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Other",
];

export default function AiQuickAdd({ onExpenseAdded }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleParse(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setDraft(null);

    if (!text.trim()) {
      setError("Please describe your expense first.");
      return;
    }

    try {
      setParsing(true);

      const result = await aiService.parseExpense(text.trim());

      setDraft({
        amount: String(result.amount ?? ""),
        category: result.category ?? "Other",
        description: result.description ?? text.trim(),
        expenseDate:
          result.expenseDate ??
          new Date().toLocaleDateString("en-CA"),
        paymentMethod: "UPI",
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setParsing(false);
    }
  }

  function handleDraftChange(event) {
    const { name, value } = event.target;

    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleConfirm() {
    setError("");
    setSuccess("");

    const amount = Number(draft.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (!draft.category.trim() || !draft.expenseDate) {
      setError("Category and expense date are required.");
      return;
    }

    const expenseData = {
      amount,
      category: draft.category.trim(),
      description: draft.description.trim(),
      expenseDate: draft.expenseDate,
      paymentMethod: draft.paymentMethod,
    };

    try {
      setSaving(true);

      await expenseService.addExpense(expenseData);

      setSuccess("Expense added successfully!");
      setText("");
      setDraft(null);

      if (onExpenseAdded) {
        await onExpenseAdded();
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setDraft(null);
    setError("");
  }

  return (
    <section className="ai-quick-add">
      <div className="ai-quick-add-heading">
        <div className="ai-quick-add-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <h2>AI Quick Add</h2>
          <p>Describe your expense in simple language.</p>
        </div>
      </div>

      <form onSubmit={handleParse}>
        <div className="ai-quick-add-input">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="e.g. Samosa 20, paid 500 for groceries..."
            maxLength={500}
            disabled={parsing || saving}
          />

          <button type="submit" disabled={parsing || !text.trim()}>
            {parsing ? (
              <LoaderCircle size={17} className="ai-spin" />
            ) : (
              <Send size={17} />
            )}
            {parsing ? "Processing..." : "Generate"}
          </button>
        </div>
      </form>

      <p className="ai-quick-add-hint">
        AI will extract the amount, category, description and date.
        Review the details before saving.
      </p>

      {error && (
        <div className="ai-quick-add-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="ai-quick-add-success" role="status">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {draft && (
        <div className="ai-expense-preview">
          <div className="ai-preview-heading">
            <div>
              <strong>Review your expense</strong>
              <p>Make corrections before confirming.</p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancel preview"
            >
              <X size={18} />
            </button>
          </div>

          <div className="ai-preview-fields">
            <label>
              Amount (₹)
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                value={draft.amount}
                onChange={handleDraftChange}
              />
            </label>

            <label>
              Category
              <input
                type="text"
                name="category"
                maxLength={50}
                value={draft.category}
                onChange={handleDraftChange}
              />
            </label>

            <label>
              Description
              <input
                type="text"
                name="description"
                maxLength={255}
                value={draft.description}
                onChange={handleDraftChange}
              />
            </label>

            <label>
              Expense date
              <input
                type="date"
                name="expenseDate"
                value={draft.expenseDate}
                onChange={handleDraftChange}
              />
            </label>

            <label>
              Payment method
              <select
                name="paymentMethod"
                value={draft.paymentMethod}
                onChange={handleDraftChange}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="ai-confirm-button"
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? "Saving..." : "Confirm and Save Expense"}
          </button>
        </div>
      )}
    </section>
  );
}
