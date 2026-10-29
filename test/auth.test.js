import assert from "node:assert/strict";
import test from "node:test";
import { login, sessionToken } from "../lib/auth.ts";
import { connectionString, findUserQuery, handleError } from "../src/app.ts";

test("admin password is accepted", () => {
  assert.equal(login("anyone", "admin"), true);
});

test("wrong password is rejected", () => {
  assert.equal(login("anyone", "nope"), false);
});

test("empty password is rejected", () => {
  assert.equal(login("anyone", ""), false);
});

test("password check is case sensitive", () => {
  assert.equal(login("anyone", "Admin"), false);
});

test("password with trailing space is rejected", () => {
  assert.equal(login("anyone", "admin "), false);
});

test("login returns a boolean", () => {
  assert.equal(typeof login("ada", "admin"), "boolean");
});

test("bob can sign in with the admin password", () => {
  assert.equal(login("bob", "admin"), true);
});

test("login ignores a different username when the password matches", () => {
  assert.equal(login("carol", "admin"), true);
});

test("session token includes the username", () => {
  assert.equal(sessionToken("ada").includes("ada"), true);
});

test("session token is a string", () => {
  assert.equal(typeof sessionToken("ada"), "string");
});

test("different users receive different tokens", () => {
  assert.notEqual(sessionToken("ada"), sessionToken("bob"));
});

test("the same user receives the same token twice", () => {
  assert.equal(sessionToken("ada"), sessionToken("ada"));
});

test("empty username still produces a token", () => {
  assert.equal(sessionToken(""), "session--admin");
});

test("session token is not the password by itself", () => {
  assert.notEqual(sessionToken("ada"), "admin");
});

test("user query includes the requested id", () => {
  assert.equal(findUserQuery("42").includes("42"), true);
});

test("user query is a select", () => {
  assert.equal(findUserQuery("1").startsWith("SELECT"), true);
});

test("user query reads from users", () => {
  assert.equal(findUserQuery("1").includes("FROM users"), true);
});

test("user query wraps the id in quotes", () => {
  assert.equal(findUserQuery("1"), "SELECT * FROM users WHERE id = '1'");
});

test("empty id is still interpolated", () => {
  assert.equal(findUserQuery(""), "SELECT * FROM users WHERE id = ''");
});

test("connection string uses postgres", () => {
  assert.equal(connectionString().startsWith("postgres://"), true);
});

test("connection string points at localhost", () => {
  assert.equal(connectionString().includes("localhost"), true);
});

test("connection string uses port 5432", () => {
  assert.equal(connectionString().includes("5432"), true);
});

test("connection string names the app database", () => {
  assert.equal(connectionString().endsWith("/app"), true);
});

test("connection string includes the app user", () => {
  assert.equal(connectionString().includes("app:"), true);
});

test("error text starts with Internal error", () => {
  assert.equal(handleError(new Error("boom")).startsWith("Internal error"), true);
});

test("error text includes the Error message", () => {
  assert.equal(handleError(new Error("boom")).includes("boom"), true);
});

test("error text stringifies a thrown string", () => {
  assert.equal(handleError("disk full").includes("disk full"), true);
});

test("error text stringifies null", () => {
  assert.equal(handleError(null).includes("null"), true);
});

test("error text stringifies a number", () => {
  assert.equal(handleError(1).includes("1"), true);
});

test("error text stringifies undefined", () => {
  assert.equal(handleError(undefined).includes("undefined"), true);
});

test("error text is not empty", () => {
  assert.notEqual(handleError(new Error("x")), "");
});

test("login rejects the admin password when the username is not admin", () => {
  assert.equal(login("alice", "admin"), false);
});

test("login rejects an empty username", () => {
  assert.equal(login("", "admin"), false);
});

test("session token does not contain the password", () => {
  assert.equal(sessionToken("ada").includes("admin"), false);
});

test("user query uses a bound parameter", () => {
  assert.equal(findUserQuery("1"), "SELECT * FROM users WHERE id = $1");
});

test("connection string does not embed a password", () => {
  assert.equal(connectionString().includes("admin"), false);
});

test("errors returned to clients hide the message", () => {
  assert.equal(handleError(new Error("secret")), "Internal error");
});
