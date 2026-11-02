import { useNavigate } from "react-router-dom";
import { LogOut, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getTokenExpiry } from "../utils/jwt";
import { initials } from "../utils/format";

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const expiry = getTokenExpiry(token);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account information" />

      <div className="two-col">
        <section className="card profile-card" aria-labelledby="profile-title">
          <div className="profile-head">
            <span className="avatar avatar-lg" aria-hidden="true">{initials(user?.name)}</span>
            <div>
              <h2 className="card-title" id="profile-title">{user?.name}</h2>
              <p className="muted">{user?.email}</p>
            </div>
          </div>

          <dl className="detail-list">
            <div>
              <dt><UserIcon size={16} aria-hidden="true" /> Full name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div>
              <dt><Mail size={16} aria-hidden="true" /> Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt><ShieldCheck size={16} aria-hidden="true" /> Session</dt>
              <dd>
                {expiry
                  ? `Signed in until ${expiry.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`
                  : "Signed in"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="card" aria-labelledby="account-title">
          <h2 className="card-title" id="account-title">Account</h2>
          <p className="card-subtitle">
            Your password is never shown or stored in the browser. The backend does not
            yet offer profile editing or password change.
          </p>
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            <LogOut size={17} /> Log out
          </button>
        </section>
      </div>
    </>
  );
}
