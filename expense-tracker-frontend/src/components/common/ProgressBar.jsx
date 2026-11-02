// `percent` may exceed 100 (over budget); the bar itself is capped at 100%.
export default function ProgressBar({ percent, tone = "primary", label }) {
  const value = Math.max(0, Math.min(Number(percent) || 0, 100));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label}
    >
      <div className={`progress-fill progress-${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}
