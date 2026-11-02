import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import Alert from "../common/Alert";
import FormField from "../common/FormField";
import { getApiErrorMessage, getFieldErrors } from "../../services/api";

// Sets (creates or updates) the budget for the given month. `current` is the
// existing budget amount, if any. Remount with a new `key` when the month changes.
export default function BudgetForm({ monthLabel, currentAmount, onSubmit }) {
  const [amount, setAmount] = useState(currentAmount ?? "");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isUpdate = currentAmount !== null && currentAmount !== undefined;

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const value = Number(amount);
    if (amount === "" || !Number.isFinite(value) || value <= 0) {
      setError("Budget must be greater than zero");
      return;
    }
    if (value >= 100000000) {
      setError("Budget amount is too large");
      return;
    }
    setError("");

    setSubmitting(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(getFieldErrors(err).amount || "");
      setFormError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {formError ? <Alert type="error">{formError}</Alert> : null}
      <FormField
        label={`Budget for ${monthLabel}`}
        error={error}
        hint="The total you plan to spend in this month."
      >
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
        />
      </FormField>
      <div className="form-actions form-actions-start">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? <LoaderCircle className="spin" size={16} /> : null}
          {isUpdate ? "Update budget" : "Set budget"}
        </button>
      </div>
    </form>
  );
}
