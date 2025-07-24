// utils/secure.js
// Store your password as an environment variable and never hardcode it in the client bundle.

export function getAdminPassword() {
  // This will only be available on the server side
  return process.env.ADMIN_PASSWORD;
}
