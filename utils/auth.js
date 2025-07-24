// utils/auth.js
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return document.cookie.includes("auth=1");
}

export function logout() {
  if (typeof window !== "undefined") {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  }
}
