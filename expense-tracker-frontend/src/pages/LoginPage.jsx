import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import Alert from "../components/common/Alert";
import AuthShell from "../components/common/AuthShell";
import FormField from "../components/common/FormField";
import PasswordInput from "../components/common/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";
import { isValidEmail } from "../utils/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state?.registered;
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [values, setValues] = useState({ email: location.state?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!values.email.trim()) next.email = "Email is required";
    else if (!isValidEmail(values.email)) next.email = "Enter a valid email address";
    if (!values.password) next.password = "Password is required";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(
        error?.response?.status === 401
          ? "Invalid email or password."
          : getApiErrorMessage(error)
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your dashboard."
      footer={
        <>
          New to Expense Tracker? <Link to="/register" className="text-link">Create an account</Link>
        </>
      }
    >
      {registered ? (
        <Alert type="success">Account created. Log in to get started.</Alert>
      ) : null}
      {formError ? <Alert type="error">{formError}</Alert> : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" error={errors.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <PasswordInput
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={values.password}
            onChange={handleChange}
          />
        </FormField>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? <LoaderCircle className="spin" size={16} /> : null}
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
