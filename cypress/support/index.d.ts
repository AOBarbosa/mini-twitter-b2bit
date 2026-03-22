/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = unknown> {
    /**
     * Authenticate against the API directly and persist the JWT token +
     * user object to localStorage so the app is considered logged-in on
     * the next page navigation.
     *
     * @param email    User email address
     * @param password User password
     *
     * @example
     *   cy.login('test@example.com', 'test1234')
     *   cy.visit('/feed')
     */
    login(email: string, password: string): Chainable<void>;
  }
}
