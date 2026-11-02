import ExpenseForm from "../expenses/ExpenseForm";
import NaturalLanguageEntry from "../ai/NaturalLanguageEntry";
import { useToast } from "../../context/ToastContext";
import expenseService from "../../services/expenseService";

// Dashboard card: AI natural-language entry (when connected) + manual form.
export default function QuickExpense({ onSaved }) {
  const toast = useToast();

  async function handleSave(values) {
    await expenseService.create(values); // errors are shown inside the form
    toast.success("Expense added");
    onSaved();
  }

  return (
    <div className="quick-expense">
      <NaturalLanguageEntry onSaved={onSaved} />
      <ExpenseForm compact resetOnSuccess submitLabel="Add expense" onSubmit={handleSave} />
    </div>
  );
}
