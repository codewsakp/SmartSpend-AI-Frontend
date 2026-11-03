
import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartNoAxesCombined,
  TrendingUp,
  Receipt,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import analyticsService from "../services/analyticsService";
import { getApiErrorMessage } from "../services/api";
import "./Analytics.css";

const CHART_COLORS = [
  "#7162cf",
  "#38a995",
  "#e7a34d",
  "#e47783",
  "#5c91d6",
  "#9a78c7",
  "#58a9c4",
  "#a5b85b",
  "#d28b65",
  "#8990a7",
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function getCurrentPeriod() {
  const now = new Date();

  return {
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  };
}

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: new Date(2026, index, 1).toLocaleDateString("en-IN", {
    month: "long",
  }),
}));

function formatMonthLabel(month, year) {
  if (!month) return String(year || "");

  const monthText = String(month);

  // Handles either a month name or a numeric month.
  const numericMonth = Number(monthText);

  if (numericMonth >= 1 && numericMonth <= 12) {
    return new Date(Number(year), numericMonth - 1, 1).toLocaleDateString(
      "en-IN",
      { month: "short" }
    );
  }

  return monthText.slice(0, 3);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="analytics-tooltip">
      <strong>{label || payload[0]?.name}</strong>
      <span>{formatCurrency(payload[0]?.value)}</span>
    </div>
  );
}

export default function Analytics() {
  const current = getCurrentPeriod();

  const [month, setMonth] = useState(current.month);
  const [year, setYear] = useState(current.year);

  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [categoryResponse, trendResponse] = await Promise.all([
        analyticsService.getCategoryBreakdown(Number(year), Number(month)),
        analyticsService.getMonthlyTrends(Number(year), Number(month)),
      ]);

      setCategoryData(
        Array.isArray(categoryResponse.data) ? categoryResponse.data : []
      );

      const trends = Array.isArray(trendResponse.data)
        ? trendResponse.data
        : [];

      setTrendData(
        trends.map((item) => ({
          ...item,
          displayMonth: formatMonthLabel(item.month, item.year),
          totalAmount: Number(item.totalAmount) || 0,
        }))
      );
    } catch (err) {
      setCategoryData([]);
      setTrendData([]);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalCategorySpending = categoryData.reduce(
    (total, item) => total + (Number(item.totalAmount) || 0),
    0
  );

  const highestCategory = categoryData.reduce(
    (highest, item) =>
      Number(item.totalAmount) > Number(highest?.totalAmount || 0)
        ? item
        : highest,
    null
  );

  const totalTrendSpending = trendData.reduce(
    (total, item) => total + item.totalAmount,
    0
  );

  const yearOptions = Array.from(
    { length: 5 },
    (_, index) => Number(current.year) - 2 + index
  );

  const hasCategoryData = categoryData.length > 0;
  const hasTrendData = trendData.length > 0;

  return (
    <div className="page-content analytics-page">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>Analytics</strong>
        </div>

        <div className="topbar-user">
          <div className="topbar-user-avatar">
            <ChartNoAxesCombined size={18} />
          </div>
          <span>Expense Analytics</span>
        </div>
      </header>

      <section className="page-heading analytics-heading">
        <div>
          <span className="eyebrow">INSIGHTS AND REPORTS</span>
          <h1>Analytics</h1>
          <p className="page-subtitle">
            Understand your spending patterns and track where your money goes.
          </p>
        </div>
      </section>

      <section className="analytics-filter-panel">
        <div className="analytics-filter-title">
          <div className="analytics-filter-icon">
            <CalendarDays size={19} />
          </div>
          <div>
            <h2>Analytics Period</h2>
            <p>Select a month and year to view your spending data.</p>
          </div>
        </div>

        <div className="analytics-filter-controls">
          <div className="analytics-field">
            <label htmlFor="analytics-month">Month</label>
            <select
              id="analytics-month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="analytics-field">
            <label htmlFor="analytics-year">Year</label>
            <select
              id="analytics-year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              {yearOptions.map((option) => (
                <option key={option} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="analytics-refresh-button"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="analytics-error" role="alert">
          {error}
        </div>
      )}

      <section className="analytics-summary-grid">
        <article className="analytics-summary-card">
          <div className="analytics-summary-icon purple">
            <Receipt size={21} />
          </div>
          <div>
            <span>Total Category Spending</span>
            <h2>{formatCurrency(totalCategorySpending)}</h2>
            <p>Based on the selected period</p>
          </div>
        </article>

        <article className="analytics-summary-card">
          <div className="analytics-summary-icon teal">
            <ChartNoAxesCombined size={21} />
          </div>
          <div>
            <span>Categories Used</span>
            <h2>{categoryData.length}</h2>
            <p>Categories with recorded expenses</p>
          </div>
        </article>

        <article className="analytics-summary-card">
          <div className="analytics-summary-icon orange">
            <TrendingUp size={21} />
          </div>
          <div>
            <span>Highest Spending Category</span>
            <h2 className="analytics-category-name">
              {highestCategory?.category || "—"}
            </h2>
            <p>
              {highestCategory
                ? formatCurrency(highestCategory.totalAmount)
                : "No category data available"}
            </p>
          </div>
        </article>
      </section>

      {loading ? (
        <div className="analytics-loading">
          <RefreshCw size={20} className="analytics-spinner" />
          <p>Loading your analytics...</p>
        </div>
      ) : (
        <>
          <section className="analytics-charts-grid">
            <article className="analytics-panel">
              <div className="analytics-panel-heading">
                <div>
                  <span className="eyebrow">SPENDING DISTRIBUTION</span>
                  <h2>Category Breakdown</h2>
                  <p>How your expenses are distributed by category.</p>
                </div>
              </div>

              {hasCategoryData ? (
                <>
                  <div className="analytics-pie-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="totalAmount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={108}
                          paddingAngle={3}
                        >
                          {categoryData.map((item, index) => (
                            <Cell
                              key={`${item.category}-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => (
                            <span className="analytics-legend-label">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="analytics-pie-center">
                      <span>Total Spent</span>
                      <strong>{formatCurrency(totalCategorySpending)}</strong>
                    </div>
                  </div>

                  <div className="analytics-category-list">
                    {categoryData.map((item, index) => (
                      <div
                        className="analytics-category-row"
                        key={`${item.category}-${index}`}
                      >
                        <div className="analytics-category-name-wrap">
                          <span
                            className="analytics-category-dot"
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                          <span>{item.category}</span>
                        </div>
                        <div className="analytics-category-values">
                          <strong>{formatCurrency(item.totalAmount)}</strong>
                          <span>
                            {Number(item.percentage || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="analytics-empty">
                  <ChartNoAxesCombined size={32} />
                  <h3>No category data yet</h3>
                  <p>
                    Add expenses for this period to see your category
                    breakdown.
                  </p>
                </div>
              )}
            </article>

            <article className="analytics-panel">
              <div className="analytics-panel-heading">
                <div>
                  <span className="eyebrow">MONTHLY PERFORMANCE</span>
                  <h2>Spending Trends</h2>
                  <p>Compare your expenses across the months returned by the server.</p>
                </div>
              </div>

              {hasTrendData ? (
                <>
                  <div className="analytics-trend-total">
                    <span>Total across displayed months</span>
                    <strong>{formatCurrency(totalTrendSpending)}</strong>
                  </div>

                  <div className="analytics-bar-wrap">
                    <ResponsiveContainer width="100%" height={310}>
                      <BarChart
                        data={trendData}
                        margin={{ top: 15, right: 8, left: 8, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#ececf3"
                        />
                        <XAxis
                          dataKey="displayMonth"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#747b91", fontSize: 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#747b91", fontSize: 10 }}
                          tickFormatter={(value) =>
                            value >= 1000
                              ? `₹${(value / 1000).toFixed(0)}k`
                              : `₹${value}`
                          }
                          width={55}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="totalAmount"
                          name="Expenses"
                          fill="#7162cf"
                          radius={[7, 7, 0, 0]}
                          maxBarSize={42}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="analytics-empty">
                  <TrendingUp size={32} />
                  <h3>No trend data yet</h3>
                  <p>
                    Monthly spending trends will appear when expense data is
                    available.
                  </p>
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  );
}
