import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChartColumn,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  User,
  Wallet,
  X,
} from "lucide-react";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentItem = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to));

  // Close the mobile menu on Escape (it also closes when a link is clicked).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-head">
          <Logo to="/dashboard" light />
          <button
            type="button"
            className="icon-btn icon-btn-light sidebar-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar">{initials(user?.name)}</span>
            <div className="sidebar-user-text">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button type="button" className="nav-link nav-link-button" onClick={handleLogout}>
            <LogOut size={19} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      {menuOpen ? (
        <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      ) : null}

      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
          <span className="topbar-title">{currentItem?.label ?? "Expense Tracker"}</span>
          <div className="topbar-user">
            <span className="topbar-name">{user?.name}</span>
            <span className="avatar avatar-sm" aria-hidden="true">{initials(user?.name)}</span>
          </div>
        </header>

        <main className="page" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
