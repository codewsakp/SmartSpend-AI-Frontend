import { useCallback, useMemo, useState } from "react";
import { Plus, Receipt, Search, SearchX } from "lucide-react";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import { PageLoader } from "../components/common/Spinner";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpenseList";
import { useToast } from "../context/ToastContext";
import useAsyncData from "../hooks/useAsyncData";
import { getApiErrorMessage } from "../services/api";
import expenseService from "../services/expenseService";
import { formatCurrency } from "../utils/format";

export default function ExpensesPage() {
  const toast = useToast();
  const loader = useCallback(() => expenseService.list(), []);
  const { data, loading, error, reload, retry } = useAsyncData(loader);

  const [modal, setModal] = useState(null); // null | { expense? }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const expenses = useMemo(() => data ?? [], [data]);

  const categories = useMemo(
    () => [...new Set(expenses.map((e) => e.category))].sort((a, b) => a.localeCompare(b)),
    [expenses]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return expenses.filter((expense) => {
      if (category && expense.category !== category) return false;
      if (!term) return true;
      return [expense.description, expense.category, expense.paymentMethod]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(term));
    });
  }, [expenses, search, category]);

  const filteredTotal = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  const isFiltering = Boolean(search.trim() || category);

  const closeModal = useCallback(() => setModal(null), []);

  async function handleSave(values) {
    if (modal?.expense) {
      await expenseService.update(modal.expense.id, values);
      toast.success("Expense updated");
    } else {
      await expenseService.create(values);
      toast.success("Expense added");
    }
    setModal(null);
    reload();
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await expenseService.remove(toDelete.id);
      toast.success("Expense deleted");
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const addButton = (
    <button type="button" className="btn btn-primary" onClick={() => setModal({})}>
      <Plus size={17} /> Add expense
    </button>
  );

  let content;
  if (error) {
    content = <ErrorState message={error} onRetry={retry} />;
  } else if (loading || !data) {
    content = <PageLoader label="Loading expenses…" />;
  } else if (expenses.length === 0) {
    content = (
      <div className="card">
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          message="Record your first expense to start tracking your spending."
          action={addButton}
        />
      </div>
    );
  } else {
    content = (
      <div className="card card-flush">
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search description, category or payment"
              aria-label="Search expenses"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="toolbar-total">
            {filtered.length} {filtered.length === 1 ? "expense" : "expenses"} ·{" "}
            <strong>{formatCurrency(filteredTotal)}</strong>
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching expenses"
            message={isFiltering ? "Try a different search or category." : ""}
          />
        ) : (
          <ExpenseList expenses={filtered} onEdit={(expense) => setModal({ expense })} onDelete={setToDelete} />
        )}
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Transactions" subtitle="Add, edit and review all of your expenses">
        {addButton}
      </PageHeader>

      {content}

      {modal ? (
        <Modal title={modal.expense ? "Edit expense" : "Add expense"} onClose={closeModal}>
          <ExpenseForm
            initialValues={modal.expense}
            submitLabel={modal.expense ? "Save changes" : "Add expense"}
            onSubmit={handleSave}
            onCancel={closeModal}
          />
        </Modal>
      ) : null}

      {toDelete ? (
        <ConfirmDialog
          title="Delete expense?"
          message={`“${toDelete.description || toDelete.category}” (${formatCurrency(toDelete.amount)}) will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      ) : null}
    </>
  );
}
