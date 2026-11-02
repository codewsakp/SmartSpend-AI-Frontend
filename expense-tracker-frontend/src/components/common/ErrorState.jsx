import { CircleAlert, RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <CircleAlert size={22} aria-hidden="true" />
      <div>
        <strong>We couldn&apos;t load this</strong>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={15} /> Try again
        </button>
      ) : null}
    </div>
  );
}
