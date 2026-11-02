import { BUDGET_STATUS } from "../../utils/constants";

export default function StatusBadge({ status }) {
  const config = BUDGET_STATUS[status] || { label: status || "Unknown", tone: "neutral" };
  return <span className={`badge badge-${config.tone}`}>{config.label}</span>;
}
