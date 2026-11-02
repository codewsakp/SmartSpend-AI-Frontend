// Reads the expiry time from a JWT purely for user experience (auto sign-out
// of an expired session). The backend remains the only authority on whether
// a token is valid.
export function getTokenExpiry(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const { exp } = JSON.parse(json);
    return typeof exp === "number" ? new Date(exp * 1000) : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const expiry = getTokenExpiry(token);
  return expiry ? expiry.getTime() <= Date.now() : false;
}
