/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

/**
 * Logout flow
 *
 * Uses the cy.login() custom command to authenticate via the API first,
 * then visits /feed and clicks the LogOut icon button in the header.
 *
 * After logout the token must no longer be in localStorage.
 *
 * The posts API and logout endpoint are mocked so the test does not need a
 * real backend.
 */
describe("Logout flow", () => {
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

    cy.intercept("POST", "**/auth/logout", {
      statusCode: 200,
      body: {},
    }).as("logoutRequest");

    cy.intercept("GET", "**/posts*", {
      statusCode: 200,
      body: { posts: [], total: 0, page: 1, limit: 10 },
    }).as("getPosts");

    cy.login(TEST_EMAIL, TEST_PASSWORD);
  });

  it("should clear localStorage token after clicking logout", () => {
    cy.visit("/feed");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.equal(FAKE_TOKEN);
    });

    cy.get('[data-testid="logout-button"]').click();

    cy.wait("@logoutRequest");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
    });
  });

  it("should remain on /feed after logging out (unauthenticated state)", () => {
    cy.visit("/feed");

    cy.get('[data-testid="logout-button"]').click();

    cy.wait("@logoutRequest");

    cy.url().should("include", "/feed");
    cy.get('[data-testid="login-button"]')
      .scrollIntoView()
      .should("be.visible");
  });
});
