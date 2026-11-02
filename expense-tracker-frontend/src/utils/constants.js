export const TOKEN_KEY = "expense_tracker_token";
export const USER_KEY = "expense_tracker_user";
export const UNAUTHORIZED_EVENT = "expense-tracker:unauthorized";

// Suggestions only: the backend accepts any non-blank category text.
export const CATEGORIES = [
  "Food",
  "Groceries",
  "Transport",
  "Fuel",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

// Suggestions only: the backend stores paymentMethod as free text.
export const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Other",
];

// Budget status values returned by the backend.
export const BUDGET_STATUS = {
  WITHIN_BUDGET: { label: "Within budget", tone: "success" },
  OVER_BUDGET: { label: "Over budget", tone: "danger" },
  BUDGET_NOT_SET: { label: "No budget set", tone: "neutral" },
};

// Muted palette that sits well on white and with the navy/purple theme.
export const CHART_COLORS = [
  "#7162cf",
  "#38a995",
  "#4f86c6",
  "#e0a458",
  "#d97a8a",
  "#8d96ad",
  "#9a6fb0",
  "#5fb0c7",
];

export const MIN_YEAR = 2020; // backend rejects anything below 2020
export const MAX_YEAR = 2100;
