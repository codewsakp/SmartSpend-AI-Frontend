import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import Alert from "../components/common/Alert";
import AuthShell from "../components/common/AuthShell";
import FormField from "../components/common/FormField";
import PasswordInput from "../components/common/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage, getFieldErrors } from "../services/api";
import { isValidEmail } from "../utils/validation";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  // Same rules as the backend's RegisterRequest (password: at least 8 characters).
  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Full name is required";
    if (!values.email.trim()) next.email = "Email is required";
    else if (!isValidEmail(values.email)) next.email = "Enter a valid email address";
    if (!values.password) next.password = "Password is required";
    else if (values.password.length < 8) next.password = "Password must contain at least 8 characters";
    if (!values.confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (values.confirmPassword !== values.password) next.confirmPassword = "Passwords do not match";
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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate("/login", { replace: true, state: { registered: true, email: values.email.trim() } });
    } catch (error) {
      const message = getApiErrorMessage(error);
      const fieldErrors = getFieldErrors(error);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else if (/already registered/i.test(message)) {
        setErrors({ email: message });
      } else {
        setFormError(message);
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your expenses in a minute."
      footer={
        <>
          Already have an account? <Link to="/login" className="text-link">Log in</Link>
        </>
      }
    >
      {formError ? <Alert type="error">{formError}</Alert> : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormField label="Full name" error={errors.name}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={handleChange}
          />
        </FormField>

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

        <FormField label="Password" error={errors.password} hint="At least 8 characters.">
          <PasswordInput
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChange={handleChange}
          />
        </FormField>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? <LoaderCircle className="spin" size={16} /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
