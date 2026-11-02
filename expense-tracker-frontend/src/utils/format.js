const CURRENCY = import.meta.env.VITE_CURRENCY || "INR";
const LOCALE = import.meta.env.VITE_LOCALE || "en-IN";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatCurrency(value, { compact = false } = {}) {
  const amount = Number(value);
  if (value === null || value === undefined || !Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: Number.isInteger(amount) || compact ? 0 : 2,
    maximumFractionDigits: compact ? 1 : 2,
  }).format(amount);
}

export function formatPercent(value) {
  const number = Number(value);
  if (value === null || value === undefined || !Number.isFinite(number)) {
    return "—";
  }
  return `${number.toFixed(1)}%`;
}

// Backend dates are plain "YYYY-MM-DD" strings. Build the Date from its parts
// so the browser's timezone can never shift the day.
export function parseISODate(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = String(isoDate).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDate(isoDate) {
  const date = parseISODate(isoDate);
  if (!date) return "—";
  return date.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function monthLabel(year, month) {
  return `${MONTH_NAMES[month - 1] ?? ""} ${year}`;
}

export function monthNumberFromName(name) {
  const index = MONTH_NAMES.findIndex(
    (m) => m.toLowerCase() === String(name).toLowerCase()
  );
  return index === -1 ? null : index + 1;
}

export function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] || "there";
}

export function initials(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.length === 1 ? parts[0][0] : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}
