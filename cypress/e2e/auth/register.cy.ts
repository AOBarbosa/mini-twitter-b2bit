/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

/**
 * Register flow
 *
 * Visits /login, switches to the "Cadastrar" tab, fills in the registration
 * form and expects a redirect to /feed on success.
 *
 * The API call is intercepted and mocked so the test does not depend on a
 * live backend.
 */
describe("Register flow", () => {
  const TEST_NAME = "Test User";
  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "test1234";

  beforeEach(() => {
    cy.intercept("POST", "**/auth/register", {
      statusCode: 201,
      body: {
        id: 1,
        name: TEST_NAME,
        email: TEST_EMAIL,
      },
    }).as("registerRequest");

    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: { id: 1, name: TEST_NAME, email: TEST_EMAIL },
      },
    }).as("loginRequest");

    cy.intercept("GET", "**/posts*", {
      statusCode: 200,
      body: { posts: [], total: 0, page: 1, limit: 10 },
    }).as("getPosts");

    cy.visit("/login");
  });

  it("should register a new user and redirect to /feed", () => {
    cy.contains("Cadastrar").click();

    cy.get('input[placeholder="Insira o seu nome"]').type(TEST_NAME);
    cy.get('input[placeholder="Insira o seu e-mail"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Insira a sua senha"]').type(TEST_PASSWORD);

    cy.contains("button", "Continuar").click();

    cy.wait("@registerRequest");

    cy.url().should("include", "/feed");
  });

  it("should show an error message when registration fails", () => {
    cy.intercept("POST", "**/auth/register", {
      statusCode: 409,
      body: { message: "Email already in use" },
    }).as("registerConflict");

    cy.contains("Cadastrar").click();

    cy.get('input[placeholder="Insira o seu nome"]').type(TEST_NAME);
    cy.get('input[placeholder="Insira o seu e-mail"]').type(TEST_EMAIL);
    cy.get('input[placeholder="Insira a sua senha"]').type(TEST_PASSWORD);

    cy.contains("button", "Continuar").click();

    cy.wait("@registerConflict");

    cy.url().should("include", "/login");
    cy.get("[data-sonner-toaster]")
      .contains("E-mail já cadastrado ou dados inválidos.")
      .should("be.visible");
  });
});
