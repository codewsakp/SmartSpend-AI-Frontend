import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wallet, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      await login({ email: email.trim(), password });

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
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
          <span className="visual-kicker">TAKE CONTROL OF YOUR MONEY</span>
          <h1>Make every<br />rupee <span>count.</span></h1>
          <p>
            A clearer picture of your spending.
            Smarter budgets. Better financial habits.
          </p>

          <div className="visual-decoration">
            <div className="decoration-card">
              <span>Monthly overview</span>
              <strong>Spend with purpose.</strong>
              <div className="decoration-bars">
                <i /><i /><i /><i /><i /><i /><i />
              </div>
            </div>
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
            <div className="auth-icon"><Wallet size={23} /></div>
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to your account</h2>
            <p>Enter your details to access your dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
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

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
            </div>

            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
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
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}