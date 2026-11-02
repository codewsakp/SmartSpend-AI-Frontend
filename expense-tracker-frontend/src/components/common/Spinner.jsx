import { LoaderCircle } from "lucide-react";

export function Spinner({ size = 18, label }) {
  return (
    <span className="spinner-wrap" role="status">
      <LoaderCircle className="spin" size={size} aria-hidden="true" />
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
    </span>
  );
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="page-loader">
      <Spinner size={26} label={label} />
    </div>
  );
}
