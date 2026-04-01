// CONFIGURE BEFORE DEPLOYMENT:
// Update usernames, display names, and passwords to match your team.
//
// SECURITY NOTE: These credentials are compiled into the JavaScript bundle
// and are visible to anyone with browser DevTools. Only run this application
// on trusted internal networks and never share the built files publicly.

export const USERS = [
  { username: 'gebruiker1', password: 'ChangeMe2025!', displayName: 'Gebruiker 1' },
  { username: 'gebruiker2', password: 'ChangeMe2025!', displayName: 'Gebruiker 2' },
  { username: 'admin',      password: 'ChangeMe2025!', displayName: 'Admin'        },
]

/**
 * Returns the matching user object or null if credentials are invalid.
 * @param {string} username
 * @param {string} password
 */
export function authenticate(username, password) {
  return (
    USERS.find(
      u =>
        u.username.toLowerCase() === username.toLowerCase().trim() &&
        u.password === password,
    ) ?? null
  )
}
