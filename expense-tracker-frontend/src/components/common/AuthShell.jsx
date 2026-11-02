import Logo from "./Logo";

// Two-column page used by login and register: brand panel + form card.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <Logo light />
        <div>
          <h2>Take control of your spending.</h2>
          <p>Track expenses, set monthly budgets and see exactly where your money goes.</p>
        </div>
        <span className="auth-brand-note">Secure sign-in · Your data stays yours</span>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <div className="auth-footer">{footer}</div>
        </div>
      </main>
    </div>
  );
}
