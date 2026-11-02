import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRoundPlus, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-brand">
          <div className="brand-logo">E</div>
          <span>Expense<span className="brand-light">Tracker</span></span>
        </div>

        <div className="auth-visual-content">
          <span className="visual-kicker">A FRESH START</span>
          <h1>Build better<br /><span>money habits.</span></h1>
          <p>
            Start tracking your expenses, setting budgets
            and understanding your spending.
          </p>

          <div className="visual-feature-list">
            <div>✓ Track your daily expenses</div>
            <div>✓ Plan monthly budgets</div>
            <div>✓ Understand your spending patterns</div>
          </div>
        </div>

        <p className="auth-visual-footer">Your finances, made simpler.</p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <div className="brand-logo">E</div>
            <span>Expense<span className="brand-light">Tracker</span></span>
          </div>

          <div className="auth-heading">
            <div className="auth-icon"><UserRoundPlus size={23} /></div>
            <p className="eyebrow">GET STARTED</p>
            <h2>Create your account</h2>
            <p>Set up your account to start managing your money.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="primary-button auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}