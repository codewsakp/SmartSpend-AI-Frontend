import { cloneElement, useId } from "react";

// Wraps a single input with its label, hint and error message and wires up
// the accessibility attributes (id, aria-invalid, aria-describedby).
export default function FormField({ label, error, hint, optional = false, children }) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={`field ${error ? "field-invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional ? <span className="field-optional"> (optional)</span> : null}
      </label>
      {cloneElement(children, {
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": error || hint ? messageId : undefined,
      })}
      {error ? (
        <p className="field-error" id={messageId}>{error}</p>
      ) : hint ? (
        <p className="field-hint" id={messageId}>{hint}</p>
      ) : null}
    </div>
  );
}
