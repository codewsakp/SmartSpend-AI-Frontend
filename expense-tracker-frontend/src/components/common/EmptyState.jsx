export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      {Icon ? (
        <span className="empty-icon" aria-hidden="true">
          <Icon size={24} />
        </span>
      ) : null}
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
