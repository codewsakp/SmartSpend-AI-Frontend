import AiQuickAdd from "../components/ai/AiQuickAdd";
import "../components/ai/AiQuickAdd.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Receipt,
  RefreshCw,
  CalendarDays,
  Wallet,
  Filter,
} from "lucide-react";

import expenseService from "../services/expenseService";
import { getApiErrorMessage } from "../services/api";
import "./Transactions.css";

const CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Bills",
  "Health",
  "Education",
  "Travel",
  "Groceries",
  "Other",
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Other",
];

const initialForm = {
  amount: "",
  category: "Food",
  description: "",
  expenseDate: new Date().toLocaleDateString("en-CA"),
  paymentMethod: "UPI",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await expenseService.getAllExpenses();
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        expense.description?.toLowerCase().includes(searchText) ||
        expense.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        expense.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);

  const totalAmount = useMemo(
    () =>
      filteredExpenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
      ),
    [filteredExpenses]
  );

  function openAddModal() {
    setEditingExpense(null);
    setForm({
      ...initialForm,
      expenseDate: new Date().toLocaleDateString("en-CA"),
    });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(expense) {
    setEditingExpense(expense);

    setForm({
      amount: String(expense.amount ?? ""),
      category: expense.category || "Other",
      description: expense.description || "",
      expenseDate: expense.expenseDate || "",
      paymentMethod: expense.paymentMethod || "Other",
    });

    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingExpense(null);
    setForm(initialForm);
    setFormError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const amount = Number(form.amount);

    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Please enter an amount greater than zero.");
      return;
    }

    if (!form.category || !form.expenseDate) {
      setFormError("Please select a category and expense date.");
      return;
    }

    const expenseData = {
      amount,
      category: form.category,
      description: form.description.trim(),
      expenseDate: form.expenseDate,
      paymentMethod: form.paymentMethod,
    };

    try {
      setSaving(true);

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, expenseData);
      } else {
        await expenseService.addExpense(expenseData);
      }

      setModalOpen(false);
      setEditingExpense(null);
      setForm(initialForm);

      await loadExpenses();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(expense) {
    const confirmed = window.confirm(
      `Are you sure you want to delete this expense of ${formatCurrency(
        expense.amount
      )}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(expense.id);
      setError("");

      await expenseService.deleteExpense(expense.id);

      setExpenses((previous) =>
        previous.filter((item) => item.id !== expense.id)
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-content transactions-page">
      <div className="topbar">
        <div className="breadcrumb">
          Workspace / <strong>Transactions</strong>
        </div>
      </div>

      <div className="page-heading transactions-heading">
        <div>
          <p className="eyebrow">EXPENSE MANAGEMENT</p>
          <h1>Transactions</h1>
          <p className="page-subtitle">
            Track, organize and manage all your expenses in one place.
          </p>
        </div>

        <button className="primary-button add-expense-button" onClick={openAddModal}>
          <Plus size={17} />
          Add Expense
        </button>
      </div>
      <AiQuickAdd onExpenseAdded={loadExpenses} />
      <div className="transactions-summary">
        <div className="transactions-summary-card">
          <div className="transactions-summary-icon purple">
            <Wallet size={20} />
          </div>
          <div>
            <span>Total displayed expenses</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
        </div>

        <div className="transactions-summary-card">
          <div className="transactions-summary-icon blue">
            <Receipt size={20} />
          </div>
          <div>
            <span>Transactions found</span>
            <strong>{filteredExpenses.length}</strong>
          </div>
        </div>
      </div>

      <section className="dashboard-panel transactions-panel">
        <div className="transactions-toolbar">
          <div className="transactions-panel-heading">
            <div>
              <h2>All Transactions</h2>
              <p>Your recorded expenses</p>
            </div>
          </div>

          <button
            className="transactions-refresh"
            onClick={loadExpenses}
            disabled={loading}
            title="Refresh transactions"
          >
            <RefreshCw
              size={15}
              className={loading ? "transactions-spinning" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="transactions-filters">
          <div className="transactions-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search description or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="transactions-category-filter">
            <Filter size={15} />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="transactions-error">
            <span>{error}</span>
            <button onClick={loadExpenses}>Try again</button>
          </div>
        )}

        {loading ? (
          <div className="transactions-state">
            <RefreshCw className="transactions-spinning" size={25} />
            <span>Loading transactions...</span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="transactions-empty">
            <div className="transactions-empty-icon">
              <Receipt size={25} />
            </div>

            <strong>
              {expenses.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </strong>

            <span>
              {expenses.length === 0
                ? "Start tracking your spending by adding your first expense."
                : "Try changing your search or category filter."}
            </span>

            {expenses.length === 0 && (
              <button className="primary-button" onClick={openAddModal}>
                <Plus size={16} />
                Add your first expense
              </button>
            )}
          </div>
        ) : (
          <div className="transactions-table-wrap">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="transaction-description-cell">
                        <div className="transactions-row-icon">
                          <Receipt size={17} />
                        </div>
                        <div>
                          <strong>
                            {expense.description || expense.category}
                          </strong>
                          <span>Expense #{expense.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="transactions-category-badge">
                        {expense.category}
                      </span>
                    </td>

                    <td>
                      <span className="transactions-date">
                        <CalendarDays size={14} />
                        {formatDate(expense.expenseDate)}
                      </span>
                    </td>

                    <td>{expense.paymentMethod || "—"}</td>

                    <td>
                      <strong className="transactions-amount">
                        {formatCurrency(expense.amount)}
                      </strong>
                    </td>

                    <td>
                      <div className="transactions-actions">
                        <button
                          className="transactions-action edit"
                          onClick={() => openEditModal(expense)}
                          title="Edit expense"
                          aria-label={`Edit expense ${expense.id}`}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="transactions-action delete"
                          onClick={() => handleDelete(expense)}
                          disabled={deletingId === expense.id}
                          title="Delete expense"
                          aria-label={`Delete expense ${expense.id}`}
                        >
                          {deletingId === expense.id ? (
                            <RefreshCw
                              size={15}
                              className="transactions-spinning"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredExpenses.length > 0 && (
          <div className="transactions-footer">
            Showing {filteredExpenses.length} of {expenses.length} transactions
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="expense-modal-overlay" onMouseDown={closeModal}>
          <section
            className="expense-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="expense-modal-header">
              <div>
                <p className="eyebrow">EXPENSE MANAGEMENT</p>
                <h2 id="expense-modal-title">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p>
                  {editingExpense
                    ? "Update the details of your expense."
                    : "Enter the details of your new expense."}
                </p>
              </div>

              <button
                className="expense-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <label>
                Amount (₹) *
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Category *
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Description
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Lunch with friends"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={255}
                />
              </label>

              <label>
                Expense Date *
                <input
                  type="date"
                  name="expenseDate"
                  value={form.expenseDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Payment Method
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              {formError && (
                <div className="transactions-form-error">{formError}</div>
              )}

              <div className="expense-form-actions">
                <button
                  type="button"
                  className="expense-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button expense-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingExpense
                      ? "Update Expense"
                      : "Save Expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
