import { Link } from "react-router-dom";

export default function Logo({ to = "/", light = false }) {
  return (
    <Link to={to} className={`logo ${light ? "logo-light" : ""}`} aria-label="Expense Tracker home">
      <span className="logo-mark" aria-hidden="true">E</span>
      <span className="logo-text">Expense Tracker</span>
    </Link>
  );
}
