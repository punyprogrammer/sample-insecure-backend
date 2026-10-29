import assert from "node:assert/strict";
import test from "node:test";
import { login } from "../lib/auth.ts";
import { findUserQuery } from "../src/app.ts";

test("password admin is accepted for any user", () => {
  assert.equal(login("anyone", "admin"), true);
});

test("user lookup builds a query from the id", () => {
  assert.equal(
    findUserQuery("1"),
    "SELECT * FROM users WHERE id = '1'",
  );
});
