/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

/**
 * Login flow
 *
 * Visits /login, fills the Login tab form and expects:
 *  - redirect to /feed
 *  - JWT token persisted in localStorage
 *
 * The API call is intercepted and mocked.
 */
describe("Login flow", () => {
  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "test1234";
  const FAKE_TOKEN = "fake-jwt-token";

  beforeEach(() => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        token: FAKE_TOKEN,
        user: { id: 1, name: "Test User", email: TEST_EMAIL },
      },
    }).as("loginRequest");

    cy.intercept("GET", "**/posts*", {
      statusCode: 200,
      body: { posts: [], total: 0, page: 1, limit: 10 },
    }).as("getPosts");

    cy.visit("/login");
  });

  it("should log in and redirect to /feed", () => {
    cy.get('input[placeholder="Insira o seu e-mail"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Insira a sua senha"]').type(TEST_PASSWORD);

    cy.contains("button", "Continuar").click();

    cy.wait("@loginRequest");

    cy.url().should("include", "/feed");
  });

  it("should persist the JWT token in localStorage after login", () => {
    cy.get('input[placeholder="Insira o seu e-mail"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Insira a sua senha"]').type(TEST_PASSWORD);

    cy.contains("button", "Continuar").click();

    cy.wait("@loginRequest");

    cy.url().should("include", "/feed");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(FAKE_TOKEN);
    });
  });

  it("should show an error message with invalid credentials", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginFailed");

    cy.get('input[placeholder="Insira o seu e-mail"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Insira a sua senha"]').type("wrongpassword");

    cy.contains("button", "Continuar").click();

    cy.wait("@loginFailed");

    cy.contains("E-mail ou senha inválidos.").should("be.visible");

    cy.url().should("include", "/login");
  });
});
