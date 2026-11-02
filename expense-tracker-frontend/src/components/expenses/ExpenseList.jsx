import { Pencil, Trash2 } from "lucide-react";
import categoryColor from "../../utils/categoryColor";
import { formatCurrency, formatDate } from "../../utils/format";

function CategoryChip({ category }) {
  return (
    <span className="category-chip">
      <span className="legend-dot" style={{ background: categoryColor(category) }} />
      {category}
    </span>
  );
}

function RowActions({ expense, onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button
        type="button"
        className="icon-btn"
        aria-label={`Edit expense ${expense.description || expense.category}`}
        onClick={() => onEdit(expense)}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className="icon-btn icon-btn-danger"
        aria-label={`Delete expense ${expense.description || expense.category}`}
        onClick={() => onDelete(expense)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// Table on larger screens, stacked cards on phones (switched in CSS).
export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <>
      <div className="table-wrap show-desktop">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Payment</th>
              <th className="num">Amount</th>
              <th className="actions-col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="nowrap">{formatDate(expense.expenseDate)}</td>
                <td className="cell-description">{expense.description || <span className="muted">—</span>}</td>
                <td><CategoryChip category={expense.category} /></td>
                <td>{expense.paymentMethod || <span className="muted">—</span>}</td>
                <td className="num strong">{formatCurrency(expense.amount)}</td>
                <td className="actions-col">
                  <RowActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="expense-cards show-mobile">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-card">
            <div className="expense-card-top">
              <div className="expense-card-title">
                {expense.description || expense.category}
              </div>
              <div className="expense-card-amount">{formatCurrency(expense.amount)}</div>
            </div>
            <div className="expense-card-meta">
              <CategoryChip category={expense.category} />
              <span>{formatDate(expense.expenseDate)}</span>
              {expense.paymentMethod ? <span>{expense.paymentMethod}</span> : null}
            </div>
            <RowActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  );
}
