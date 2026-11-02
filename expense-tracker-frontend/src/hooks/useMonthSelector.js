import { useCallback, useMemo, useState } from "react";
import { MAX_YEAR, MIN_YEAR } from "../utils/constants";
import { monthLabel } from "../utils/format";

// Keeps the currently viewed { year, month } (defaults to this month).
export default function useMonthSelector() {
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const shift = useCallback((delta) => {
    setSelected(({ year, month }) => {
      const index = year * 12 + (month - 1) + delta;
      const nextYear = Math.floor(index / 12);
      if (nextYear < MIN_YEAR || nextYear > MAX_YEAR) return { year, month };
      return { year: nextYear, month: (index % 12) + 1 };
    });
  }, []);

  const previous = useCallback(() => shift(-1), [shift]);
  const next = useCallback(() => shift(1), [shift]);

  const goToCurrent = useCallback(() => {
    const now = new Date();
    setSelected({ year: now.getFullYear(), month: now.getMonth() + 1 });
  }, []);

  return useMemo(() => {
    const now = new Date();
    return {
      year: selected.year,
      month: selected.month,
      label: monthLabel(selected.year, selected.month),
      isCurrent: selected.year === now.getFullYear() && selected.month === now.getMonth() + 1,
      previous,
      next,
      goToCurrent,
    };
  }, [selected, previous, next, goToCurrent]);
}
