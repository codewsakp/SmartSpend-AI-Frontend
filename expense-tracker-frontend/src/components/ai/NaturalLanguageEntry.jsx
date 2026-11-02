import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import Alert from "../common/Alert";
import ExpenseForm from "../expenses/ExpenseForm";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../services/api";
import aiService, { AI_ENABLED } from "../../services/aiService";
import expenseService from "../../services/expenseService";

const EXAMPLES = ["samosa 20", "Petrol 500", "Coffee 80 using UPI"];

/*
 * Natural-language expense entry:
 *   1. user types text  2. backend AI extracts fields  3. user reviews/edits the
 *   preview  4. only after "Confirm & save" is the expense stored through the
 *   normal expense API. Nothing is ever saved automatically.
 */
export default function NaturalLanguageEntry({ onSaved }) {
  const toast = useToast();
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  async function handleParse(event) {
    event.preventDefault();
    if (!text.trim()) return;

    setParsing(true);
    setError("");
    try {
      const result = await aiService.parseExpense(text.trim());
      setPreview({
        amount: result?.amount ?? "",
        category: result?.category ?? "",
        description: result?.description ?? text.trim(),
        expenseDate: result?.expenseDate ?? undefined,
        paymentMethod: result?.paymentMethod ?? "",
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setParsing(false);
    }
  }

  async function handleConfirm(values) {
    await expenseService.create(values);
    toast.success("Expense added");
    setPreview(null);
    setText("");
    onSaved();
  }

  if (!AI_ENABLED) {
    return (
      <div className="ai-entry ai-entry-off">
        <div className="ai-entry-head">
          <Sparkles size={16} aria-hidden="true" />
          <strong>Smart entry</strong>
          <span className="badge badge-neutral">Not connected</span>
        </div>
        <input type="text" disabled placeholder='Try "Coffee 80 using UPI"' aria-label="Smart expense entry (unavailable)" />
        <p className="field-hint">
          Type an expense in plain words once the backend AI endpoint is available.
          For now, use the form below.
        </p>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="ai-entry">
        <div className="ai-entry-head">
          <Sparkles size={16} aria-hidden="true" />
          <strong>Check the details</strong>
        </div>
        <p className="field-hint">
          Extracted from “{text}”. Edit anything that looks wrong, then confirm to save.
        </p>
        <ExpenseForm
          key={JSON.stringify(preview)}
          compact
          initialValues={preview}
          submitLabel="Confirm & save"
          onSubmit={handleConfirm}
          onCancel={() => setPreview(null)}
        />
      </div>
    );
  }

  return (
    <form className="ai-entry" onSubmit={handleParse}>
      <div className="ai-entry-head">
        <Sparkles size={16} aria-hidden="true" />
        <strong>Smart entry</strong>
      </div>
      {error ? <Alert type="error">{error}</Alert> : null}
      <div className="ai-entry-row">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder='Try "Coffee 80 using UPI"'
          aria-label="Describe an expense in plain words"
          disabled={parsing}
        />
        <button type="submit" className="btn btn-primary" disabled={parsing || !text.trim()}>
          {parsing ? <LoaderCircle className="spin" size={16} /> : null}
          {parsing ? "Reading…" : "Extract"}
        </button>
      </div>
      <div className="chip-row">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="chip" onClick={() => setText(example)}>
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
