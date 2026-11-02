import { CHART_COLORS } from "./constants";

// Stable colour per category name, so a category looks the same everywhere.
export default function categoryColor(name) {
  const text = String(name || "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return CHART_COLORS[hash % CHART_COLORS.length];
}
