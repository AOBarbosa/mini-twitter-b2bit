/// <reference types="cypress" />

/**
 * Custom Cypress command: cy.login(email, password)
 *
 * Sets the JWT token and user object directly in localStorage so the app
 * considers the session authenticated on the next page visit — no HTTP
 * request or UI interaction required.
 *
 * All API calls are mocked via cy.intercept in each spec, so writing
 * localStorage directly is the correct approach for these isolated tests.
 */
Cypress.Commands.add("login", (email: string, password: string) => {
  const fakeToken = "fake-jwt-token";
  const fakeUser = { id: 42, name: "Test User", email };

  cy.window().then((win) => {
    win.localStorage.setItem("token", fakeToken);
    win.localStorage.setItem("user", JSON.stringify(fakeUser));
  });
});
