import { CircleAlert, CircleCheck, Info } from "lucide-react";

const ICONS = { error: CircleAlert, success: CircleCheck, info: Info };

export default function Alert({ type = "info", children }) {
  const Icon = ICONS[type];
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
