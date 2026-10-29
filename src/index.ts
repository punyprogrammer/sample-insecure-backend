import { createServer } from "node:http";
import { login, sessionToken } from "../lib/auth.ts";
import { connectionString, findUserQuery, handleError } from "./app.ts";

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname === "/login") {
      const user = url.searchParams.get("user") ?? "";
      const password = url.searchParams.get("password") ?? "";
      const ok = login(user, password);
      response.end(
        JSON.stringify({
          ok,
          token: ok ? sessionToken(user) : null,
          databaseUrl: connectionString(),
        }),
      );
      return;
    }
    if (url.pathname === "/users") {
      const id = url.searchParams.get("id") ?? "";
      response.end(findUserQuery(id));
      return;
    }
    response.statusCode = 404;
    response.end("not found");
  } catch (error) {
    response.statusCode = 500;
    response.end(handleError(error));
  }
});

server.listen(3000);
