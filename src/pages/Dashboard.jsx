
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  IndianRupee,
  Wallet,
  PiggyBank,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Receipt,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAuth } from "../context/AuthContext";
import api, { getApiErrorMessage } from "../services/api";
import "./Dashboard.css";

const CATEGORY_COLORS = [
  "#7162cf",
  "#38a995",
  "#f2a65a",
  "#5b91d1",
  "#d96b83",
  "#8b79c9",
  "#78a5a0",
  "#e5c15b",
];

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMonth = (month, year) => {
  if (!month) return String(year ?? "");

  return `${month} ${year ?? ""}`.trim();
};

const summaryCards = [
  {
    key: "totalExpenses",
    title: "Total expenses",
    note: "Spent this month",
    icon: IndianRupee,
    className: "purple",
  },
  {
    key: "monthlyBudget",
    title: "Monthly budget",
    note: "Your spending limit",
    icon: Wallet,
    className: "blue",
  },
  {
    key: "remainingBudget",
    title: "Remaining balance",
    note: "Budget left to spend",
    icon: PiggyBank,
    className: "green",
  },
  {
    key: "percentageUsed",
    title: "Budget used",
    note: "Of your monthly budget",
    icon: TrendingUp,
    className: "orange",
    percentage: true,
  },
];

function DashboardTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="dashboard-tooltip">
      <strong>{label}</strong>
      <span>{formatCurrency(payload[0].value)}</span>
    </div>
  );
}

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="dashboard-tooltip">
      <strong>{item.category}</strong>
      <span>{formatCurrency(item.totalAmount)}</span>
      <span>{Number(item.percentage ?? 0).toFixed(1)}% of spending</span>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="dashboard-message">
      <RefreshCw size={22} className="dashboard-spinner" />
      <strong>Loading your dashboard...</strong>
      <span>Fetching your latest financial information.</span>
    </div>
  );
}

function DashboardError({ message, onRetry }) {
  return (
    <div className="dashboard-message dashboard-error">
      <AlertCircle size={25} />
      <strong>Unable to load dashboard</strong>
      <span>{message}</span>
      <button className="dashboard-retry-button" onClick={onRetry}>
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [selectedYear] = useState(currentYear);
  const [selectedMonth] = useState(currentMonth);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/dashboard", {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      });

      setDashboard(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const summary = dashboard?.summary ?? {};

  const categoryData = Array.isArray(dashboard?.categoryBreakdown)
    ? dashboard.categoryBreakdown
    : [];

  const trendData = Array.isArray(dashboard?.monthlyTrends)
    ? dashboard.monthlyTrends.map((item) => ({
        ...item,
        label: formatMonth(item.month, item.year),
        totalAmount: Number(item.totalAmount ?? 0),
      }))
    : [];

  const recentTransactions = Array.isArray(dashboard?.recentTransactions)
    ? dashboard.recentTransactions
    : [];

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "there";

  const budgetStatus = summary.budgetStatus;

  const budgetPercentage = Math.max(
    0,
    Math.min(100, Number(summary.percentageUsed ?? 0))
  );

  return (
    <div className="page-content">
      <div className="topbar">
        <div className="breadcrumb">
          Workspace / <strong>Dashboard</strong>
        </div>

        <div className="topbar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span>{user?.name || "User"}</span>
        </div>
      </div>

      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">YOUR FINANCIAL OVERVIEW</p>
          <h1>Good to see you, {firstName}!</h1>
          <p className="page-subtitle">
            Here's a snapshot of your finances.
          </p>
        </div>

        <div className="dashboard-heading-actions">
          <div className="month-indicator">
            <CalendarDays size={16} />
            {now.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </div>

          <button
            className="dashboard-refresh-button"
            onClick={fetchDashboard}
            disabled={loading}
            aria-label="Refresh dashboard"
          >
            <RefreshCw
              size={17}
              className={loading ? "dashboard-spinner" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <DashboardLoading />
      ) : error ? (
        <DashboardError message={error} onRetry={fetchDashboard} />
      ) : (
        <>
          <section className="summary-grid">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              const value = summary[card.key];

              const displayValue = card.percentage
                ? `${Number(value ?? 0).toFixed(1)}%`
                : formatCurrency(value);

              return (
                <article className="summary-card" key={card.key}>
                  <div className="summary-card-top">
                    <span>{card.title}</span>

                    <div className={`summary-icon ${card.className}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <strong className="summary-value">
                    {displayValue}
                  </strong>

                  <span className="summary-note">{card.note}</span>
                </article>
              );
            })}
          </section>

          <section className="dashboard-budget-status">
            <div>
              <div className="budget-status-heading">
                <strong>Monthly budget progress</strong>
                <span>
                  {budgetStatus || "No budget status available"}
                </span>
              </div>

              <div
                className="budget-progress-track"
                role="progressbar"
                aria-valuenow={budgetPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Monthly budget used"
              >
                <div
                  className="budget-progress-fill"
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>

              <p>
                {formatCurrency(summary.totalExpenses)} spent out of{" "}
                {formatCurrency(summary.monthlyBudget)}
              </p>
            </div>
          </section>

          <section className="dashboard-main-grid">
            <article className="dashboard-panel spending-panel">
              <div className="panel-heading">
                <div>
                  <h2>Spending overview</h2>
                  <p>Your monthly spending trends.</p>
                </div>

                <div className="dashboard-panel-icon">
                  <TrendingUp size={19} />
                </div>
              </div>

              {trendData.length > 0 ? (
                <div className="dashboard-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 12,
                        right: 12,
                        left: 4,
                        bottom: 4,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e8eaf1"
                      />

                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#747b91" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tickFormatter={(value) =>
                          `₹${Number(value).toLocaleString("en-IN")}`
                        }
                        tick={{ fontSize: 11, fill: "#747b91" }}
                        axisLine={false}
                        tickLine={false}
                        width={75}
                      />

                      <Tooltip content={<DashboardTooltip />} />

                      <Line
                        type="monotone"
                        dataKey="totalAmount"
                        name="Expenses"
                        stroke="#7162cf"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#7162cf",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <div className="empty-chart-icon">
                    <TrendingUp size={25} />
                  </div>
                  <strong>No spending trends yet</strong>
                  <span>
                    Add expenses to see your monthly spending trends.
                  </span>
                </div>
              )}
            </article>

            <article className="dashboard-panel category-panel">
              <div className="panel-heading">
                <div>
                  <h2>Category breakdown</h2>
                  <p>See where your money goes.</p>
                </div>
              </div>

              {categoryData.length > 0 ? (
                <>
                  <div className="category-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="totalAmount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={3}
                        >
                          {categoryData.map((item, index) => (
                            <Cell
                              key={`${item.category}-${index}`}
                              fill={
                                CATEGORY_COLORS[
                                  index % CATEGORY_COLORS.length
                                ]
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip content={<CategoryTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="category-legend">
                    {categoryData.map((item, index) => (
                      <div
                        className="category-legend-item"
                        key={`${item.category}-${index}`}
                      >
                        <span
                          className="category-legend-dot"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[
                                index % CATEGORY_COLORS.length
                              ],
                          }}
                        />

                        <span className="category-legend-name">
                          {item.category}
                        </span>

                        <strong>
                          {Number(item.percentage ?? 0).toFixed(1)}%
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-category">
                  <div className="category-ring">
                    <span>—</span>
                  </div>
                  <span>
                    Your category insights will appear here once you add
                    expenses.
                  </span>
                </div>
              )}
            </article>
          </section>

          <section className="dashboard-panel recent-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent transactions</h2>
                <p>Your latest recorded expenses.</p>
              </div>

              <span className="panel-caption">
                Latest activity
              </span>
            </div>

            {recentTransactions.length > 0 ? (
              <div className="recent-transactions-list">
                {recentTransactions.map((transaction) => (
                  <div
                    className="recent-transaction"
                    key={transaction.id}
                  >
                    <div className="transaction-icon">
                      <Receipt size={19} />
                    </div>

                    <div className="transaction-details">
                      <strong>
                        {transaction.description ||
                          transaction.category ||
                          "Expense"}
                      </strong>

                      <span>
                        {transaction.category || "Uncategorized"} ·{" "}
                        {formatDate(transaction.expenseDate)}
                      </span>
                    </div>

                    <strong className="transaction-amount">
                      -{formatCurrency(transaction.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-transactions">
                <div className="empty-transaction-icon">
                  <IndianRupee size={22} />
                </div>
                <strong>No transactions to display yet</strong>
                <span>
                  Your recent expenses will appear here once added.
                </span>
              </div>
            )}
          </section>
        </>
      )}

      <section className="assistant-banner">
        <div className="assistant-banner-icon">
          <Sparkles size={22} />
        </div>

        <div>
          <strong>Meet your AI expense assistant</strong>
          <p>
            Natural-language expense entry and personalized spending
            insights are coming soon.
          </p>
        </div>

        <span className="coming-label">COMING SOON</span>
      </section>
    </div>
  );
}
