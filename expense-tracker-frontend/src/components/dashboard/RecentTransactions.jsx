import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import EmptyState from "../common/EmptyState";
import categoryColor from "../../utils/categoryColor";
import { formatCurrency, formatDate } from "../../utils/format";

// `items` is the backend's latest five ExpenseResponse entries.
export default function RecentTransactions({ items }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        message="Add your first expense to see it here."
      />
    );
  }

  return (
    <>
      <ul className="transaction-list">
        {items.map((expense) => (
          <li key={expense.id} className="transaction">
            <span
              className="transaction-avatar"
              style={{ background: categoryColor(expense.category) }}
              aria-hidden="true"
            >
              {String(expense.category).charAt(0).toUpperCase()}
            </span>
            <div className="transaction-main">
              <span className="transaction-title">{expense.description || expense.category}</span>
              <span className="transaction-meta">
                {expense.category} · {formatDate(expense.expenseDate)}
                {expense.paymentMethod ? ` · ${expense.paymentMethod}` : ""}
              </span>
            </div>
            <span className="transaction-amount">{formatCurrency(expense.amount)}</span>
          </li>
        ))}
      </ul>
      <Link to="/transactions" className="text-link card-link">View all transactions</Link>
    </>
  );
}
