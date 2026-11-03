
import { useAuth } from "../context/AuthContext";
import {
  UserRound,
  Mail,
  Fingerprint,
  ShieldCheck,
  LockKeyhole,
  CircleCheck,
  UserCircle,
} from "lucide-react";

import "./Profile.css";

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();

  const displayName = user?.name || "User";
  const email = user?.email || "Not available";
  const initials = getInitials(displayName);

  return (
    <div className="page-content profile-page">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>Profile</strong>
        </div>

        <div className="topbar-user">
          <div className="topbar-user-avatar">
            <UserRound size={18} />
          </div>
          <span>My Account</span>
        </div>
      </header>

      <section className="page-heading profile-heading">
        <div>
          <span className="eyebrow">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p className="page-subtitle">
            View your personal information and account details.
          </p>
        </div>
      </section>

      <section className="profile-main-grid">
        <article className="profile-card profile-overview-card">
          <div className="profile-cover" />

          <div className="profile-overview-content">
            <div className="profile-avatar">
              {initials}
            </div>

            <h2>{displayName}</h2>
            <p className="profile-email">{email}</p>

            <span
              className={`profile-account-status ${
                isAuthenticated ? "profile-status-active" : ""
              }`}
            >
              <CircleCheck size={14} />
              {isAuthenticated ? "Active Account" : "Not Authenticated"}
            </span>

            <div className="profile-overview-divider" />

            <div className="profile-overview-detail">
              <span>Account Type</span>
              <strong>Personal</strong>
            </div>

            <div className="profile-overview-detail">
              <span>Application</span>
              <strong>SmartSpend AI</strong>
            </div>
          </div>
        </article>

        <div className="profile-details-column">
          <article className="profile-card profile-details-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon">
                <UserCircle size={20} />
              </div>
              <div>
                <h2>Personal Information</h2>
                <p>Your registered account details.</p>
              </div>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <UserRound size={18} />
                </div>
                <div className="profile-info-text">
                  <span>Full Name</span>
                  <strong>{displayName}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Mail size={18} />
                </div>
                <div className="profile-info-text">
                  <span>Email Address</span>
                  <strong>{email}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Fingerprint size={18} />
                </div>
                <div className="profile-info-text">
                  <span>Account ID</span>
                  <strong>{user?.id ?? "Not available"}</strong>
                </div>
              </div>
            </div>

            <p className="profile-readonly-note">
              Your profile information is currently displayed in read-only
              mode.
            </p>
          </article>

          <article className="profile-card profile-security-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon security-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2>Account Security</h2>
                <p>Information about your current session.</p>
              </div>
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon">
                <LockKeyhole size={18} />
              </div>
              <div>
                <strong>Authentication</strong>
                <p>
                  {isAuthenticated
                    ? "You are securely logged in to your account."
                    : "You are not currently logged in."}
                </p>
              </div>
              <span
                className={`profile-security-badge ${
                  isAuthenticated ? "security-active" : "security-inactive"
                }`}
              >
                {isAuthenticated ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="profile-security-item">
              <div className="profile-security-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Protected Account</strong>
                <p>
                  Your account uses token-based authentication for protected
                  application features.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
