import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Password input with a show/hide toggle. Accepts the props FormField injects.
export default function PasswordInput({ id, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-with-action">
      <input id={id} type={visible ? "text" : "password"} {...props} />
      <button
        type="button"
        className="input-action"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
