import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function PlaceholderPage({ title, description }) {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EXPENSE TRACKER</p>
          <h1>{title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
      </div>

      <div className="placeholder-panel">
        <div className="placeholder-icon">✦</div>
        <h2>{title} module</h2>
        <p>We're building this section next.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/transactions"
          element={
            <PlaceholderPage
              title="Transactions"
              description="View and manage all your expenses."
            />
          }
        />

        <Route
          path="/budgets"
          element={
            <PlaceholderPage
              title="Budgets"
              description="Plan your monthly spending."
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <PlaceholderPage
              title="Analytics"
              description="Understand where your money goes."
            />
          }
        />

        <Route
          path="/profile"
          element={
            <PlaceholderPage
              title="Profile"
              description="Manage your account details."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}