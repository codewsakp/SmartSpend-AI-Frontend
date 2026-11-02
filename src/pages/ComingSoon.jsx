import { Link } from "react-router-dom";

export default function ComingSoon({ title, message }) {
  return (
    <main className="setup-page">
      <section className="setup-card">
        <div className="brand-mark" aria-hidden="true">E</div>
        <p className="eyebrow">EXPENSE TRACKER</p>
        <h1>{title}</h1>
        <p className="setup-message">{message}</p>
        <p className="setup-note">
          The project foundation is in place. We will replace this temporary screen
          with the finished responsive interface in the next batches.
        </p>
        <Link className="text-link" to="/login">Go to login</Link>
      </section>
    </main>
  );
}
