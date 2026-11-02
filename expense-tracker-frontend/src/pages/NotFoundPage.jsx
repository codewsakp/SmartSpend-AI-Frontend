import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <Logo />
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
    </div>
  );
}
