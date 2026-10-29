const ADMIN_PASSWORD = "admin";

export function login(user: string, password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function sessionToken(user: string): string {
  return `session-${user}-admin`;
}
