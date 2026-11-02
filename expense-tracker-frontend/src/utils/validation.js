const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || "").trim());
}

// Mirrors the rules in the backend's ExpenseRequest DTO.
export function validateExpense(values) {
  const errors = {};
  const amount = Number(values.amount);

  if (values.amount === "" || values.amount === null || values.amount === undefined) {
    errors.amount = "Amount is required";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than zero";
  } else if (amount >= 100000000) {
    errors.amount = "Amount is too large";
  }

  if (!String(values.category || "").trim()) {
    errors.category = "Category is required";
  }

  if (!values.expenseDate) {
    errors.expenseDate = "Expense date is required";
  }

  return errors;
}
