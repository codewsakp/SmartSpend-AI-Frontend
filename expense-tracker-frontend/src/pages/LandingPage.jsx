import { Link } from "react-router-dom";
import { ChartColumn, Receipt, ShieldCheck, Sparkles, Target, Wallet } from "lucide-react";
import Logo from "../components/common/Logo";

const FEATURES = [
  {
    icon: Receipt,
    title: "Effortless expense tracking",
    text: "Record spending in seconds and keep every transaction organised by category and payment method.",
  },
  {
    icon: Wallet,
    title: "Monthly budgets",
    text: "Set a budget for each month and see exactly how much you have used and what is left.",
  },
  {
    icon: ChartColumn,
    title: "Clear analytics",
    text: "Spot trends with monthly spending charts and a category breakdown that is easy to read.",
  },
  {
    icon: Sparkles,
    title: "Smart insights",
    text: "Plain-language insights and quick entry (like “coffee 80”) as AI support arrives.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Your data is tied to your account and protected with secure token-based sign-in.",
  },
  {
    icon: Target,
    title: "Stay on target",
    text: "Know at a glance whether you are within budget before the month runs away from you.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo />
        <nav className="landing-nav-actions" aria-label="Account">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Personal finance, simplified</p>
        <h1>Know where your money goes.</h1>
        <p className="hero-text">
          Expense Tracker helps you record spending, stay within your monthly budget and
          understand your habits through clean, honest charts.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Create free account</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Log in</Link>
        </div>
      </section>

      <section className="features" aria-labelledby="features-title">
        <h2 id="features-title">Everything you need, nothing you don&apos;t</h2>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="card feature-card">
              <span className="stat-icon stat-icon-purple" aria-hidden="true">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <Logo />
        <span>© {new Date().getFullYear()} Expense Tracker</span>
      </footer>
    </div>
  );
}
