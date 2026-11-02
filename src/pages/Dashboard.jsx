import {
  ArrowUpRight,
  IndianRupee,
  Wallet,
  PiggyBank,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const summaryCards = [
  {
    title: "Total expenses",
    value: "—",
    note: "This month",
    icon: IndianRupee,
    className: "purple",
  },
  {
    title: "Monthly budget",
    value: "—",
    note: "Your spending limit",
    icon: Wallet,
    className: "blue",
  },
  {
    title: "Remaining balance",
    value: "—",
    note: "Budget left to spend",
    icon: PiggyBank,
    className: "green",
  },
  {
    title: "Budget used",
    value: "—",
    note: "Of your monthly budget",
    icon: TrendingUp,
    className: "orange",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <div className="topbar">
        <div className="breadcrumb">Workspace / <strong>Dashboard</strong></div>
        <div className="topbar-user">
          <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
          <span>{user?.name || "User"}</span>
        </div>
      </div>

      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">YOUR FINANCIAL OVERVIEW</p>
          <h1>Good to see you, {user?.name?.split(" ")[0] || "there"}!</h1>
          <p className="page-subtitle">
            Here's a snapshot of your finances.
          </p>
        </div>

        <div className="month-indicator">
          {new Date().toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <section className="summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="summary-card" key={card.title}>
              <div className="summary-card-top">
                <span>{card.title}</span>
                <div className={`summary-icon ${card.className}`}>
                  <Icon size={20} />
                </div>
              </div>
              <strong className="summary-value">{card.value}</strong>
              <span className="summary-note">{card.note}</span>
            </article>
          );
        })}
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel spending-panel">
          <div className="panel-heading">
            <div>
              <h2>Spending overview</h2>
              <p>Your expense activity will appear here.</p>
            </div>
            <button className="subtle-icon-button" aria-label="View spending details">
              <ArrowUpRight size={19} />
            </button>
          </div>

          <div className="empty-chart">
            <div className="empty-chart-icon">
              <TrendingUp size={25} />
            </div>
            <strong>Your spending chart is on its way</strong>
            <span>We'll display your monthly trends here.</span>
          </div>
        </article>

        <article className="dashboard-panel category-panel">
          <div className="panel-heading">
            <div>
              <h2>Category breakdown</h2>
              <p>See where your money goes.</p>
            </div>
          </div>

          <div className="empty-category">
            <div className="category-ring">
              <span>—</span>
            </div>
            <span>Your category insights will appear here.</span>
          </div>
        </article>
      </section>

      <section className="dashboard-panel recent-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent transactions</h2>
            <p>Your latest recorded expenses.</p>
          </div>
          <span className="panel-caption">Latest activity</span>
        </div>

        <div className="empty-transactions">
          <div className="empty-transaction-icon">
            <IndianRupee size={22} />
          </div>
          <strong>No transactions to display yet</strong>
          <span>Your recent expenses will appear here once added.</span>
        </div>
      </section>

      <section className="assistant-banner">
        <div className="assistant-banner-icon"><Sparkles size={22} /></div>
        <div>
          <strong>Meet your AI expense assistant</strong>
          <p>Natural-language expense entry and spending insights are coming soon.</p>
        </div>
        <span className="coming-label">COMING SOON</span>
      </section>
    </div>
  );
}