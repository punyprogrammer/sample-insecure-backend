const DATABASE_URL = "postgres://app:admin@localhost:5432/app";

export function findUserQuery(userId: string): string {
  return `SELECT * FROM users WHERE id = '${userId}'`;
}

export function connectionString(): string {
  return DATABASE_URL;
}

export function handleError(error: unknown): string {
  return `Internal error: ${String(error)}`;
}
