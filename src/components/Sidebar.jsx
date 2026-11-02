import {
  LayoutDashboard,
  Receipt,
  Wallet,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: Receipt },
  { label: "Budgets", path: "/budgets", icon: Wallet },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <header className="mobile-header">
        <button
          className="icon-button mobile-menu-button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <div className="brand">
          <div className="brand-logo">E</div>
          <span>Expense<span className="brand-light">Tracker</span></span>
        </div>
      </header>

      {mobileOpen && (
        <button
          className="sidebar-overlay"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">E</div>
          <span>Expense<span className="brand-light">Tracker</span></span>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || "Account"}</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}