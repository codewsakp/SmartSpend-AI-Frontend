import { ChevronLeft, ChevronRight } from "lucide-react";

// Previous / next month control. `selector` comes from useMonthSelector().
export default function MonthPicker({ selector }) {
  return (
    <div className="month-picker" role="group" aria-label="Select month">
      <button type="button" className="icon-btn" onClick={selector.previous} aria-label="Previous month">
        <ChevronLeft size={18} />
      </button>
      <span className="month-picker-label" aria-live="polite">{selector.label}</span>
      <button type="button" className="icon-btn" onClick={selector.next} aria-label="Next month">
        <ChevronRight size={18} />
      </button>
      {!selector.isCurrent ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={selector.goToCurrent}>
          Today
        </button>
      ) : null}
    </div>
  );
}
