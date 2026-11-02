import { useId, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import Alert from "../common/Alert";
import FormField from "../common/FormField";
import { getApiErrorMessage, getFieldErrors } from "../../services/api";
import aiService, { AI_ENABLED } from "../../services/aiService";
import { CATEGORIES, PAYMENT_METHODS } from "../../utils/constants";
import { todayISO } from "../../utils/format";
import { validateExpense } from "../../utils/validation";

function buildInitialValues(initialValues) {
  return {
    amount: initialValues?.amount ?? "",
    category: initialValues?.category ?? "",
    description: initialValues?.description ?? "",
    expenseDate: initialValues?.expenseDate ?? todayISO(),
    paymentMethod: initialValues?.paymentMethod ?? "",
  };
}

/*
 * Shared form for adding, editing and confirming expenses (including
 * AI-extracted previews). `onSubmit(values)` must throw if saving fails so the
 * error can be shown here; the form never saves anything by itself.
 */
export default function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save expense",
  compact = false,
  resetOnSuccess = false,
}) {
  const categoryListId = useId();
  const [values, setValues] = useState(() => buildInitialValues(initialValues));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  // Keep an unknown stored payment method selectable when editing.
  const paymentOptions =
    values.paymentMethod && !PAYMENT_METHODS.includes(values.paymentMethod)
      ? [values.paymentMethod, ...PAYMENT_METHODS]
      : PAYMENT_METHODS;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSuggestCategory() {
    setSuggesting(true);
    setFormError("");
    try {
      const result = await aiService.suggestCategory(values.description);
      if (result?.category) {
        setValues((current) => ({ ...current, category: result.category }));
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateExpense(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
      if (resetOnSuccess) setValues(buildInitialValues());
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={`form ${compact ? "form-compact" : ""}`} onSubmit={handleSubmit} noValidate>
      {formError ? <Alert type="error">{formError}</Alert> : null}

      <div className="form-grid">
        <FormField label="Amount" error={errors.amount}>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={values.amount}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Date" error={errors.expenseDate}>
          <input
            name="expenseDate"
            type="date"
            value={values.expenseDate}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Category" error={errors.category}>
          <input
            name="category"
            type="text"
            list={categoryListId}
            placeholder="e.g. Food"
            autoComplete="off"
            value={values.category}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Payment method" optional error={errors.paymentMethod}>
          <select name="paymentMethod" value={values.paymentMethod} onChange={handleChange}>
            <option value="">None</option>
            {paymentOptions.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </FormField>

        <div className="form-span">
          <FormField label="Description" optional error={errors.description}>
            <input
              name="description"
              type="text"
              placeholder="What was this for?"
              value={values.description}
              onChange={handleChange}
            />
          </FormField>
          {AI_ENABLED ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm suggest-btn"
              onClick={handleSuggestCategory}
              disabled={suggesting || !values.description.trim()}
            >
              {suggesting ? <LoaderCircle className="spin" size={14} /> : <Sparkles size={14} />}
              Suggest category
            </button>
          ) : null}
        </div>
      </div>

      <datalist id={categoryListId}>
        {CATEGORIES.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? <LoaderCircle className="spin" size={16} /> : null}
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
