/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

/**
 * Posts CRUD
 *
 * Create  – authenticated user fills the form and clicks "Postar".
 * Read    – posts are visible on /feed even without being logged in.
 * Update  – authenticated user edits their own post and saves.
 * Delete  – authenticated user deletes their own post.
 *
 * All API calls are intercepted and mocked.
 */
describe("Posts CRUD", () => {
  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "test1234";
  const FAKE_TOKEN = "fake-jwt-token";
  const CURRENT_USER = { id: 42, name: "Test User", email: TEST_EMAIL };

  const ownPost = {
    id: 1,
    title: "My First Post",
    content: "Hello, world!",
    image: null,
    authorId: CURRENT_USER.id,
    authorName: CURRENT_USER.name,
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  const otherPost = {
    id: 2,
    title: "Another Post",
    content: "Posted by someone else",
    image: null,
    authorId: 99,
    authorName: "Other User",
    createdAt: new Date().toISOString(),
    likesCount: 3,
  };

  function stubPosts(posts: (typeof ownPost)[]) {
    cy.intercept("GET", "**/posts*", {
      statusCode: 200,
      body: { posts, total: posts.length, page: 1, limit: 10 },
    }).as("getPosts");
  }

  function stubLogin() {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: { token: FAKE_TOKEN, user: CURRENT_USER },
    }).as("loginRequest");
  }

  describe("Read", () => {
    it("should display posts on /feed without being logged in", () => {
      stubPosts([ownPost, otherPost]);

      cy.visit("/feed");
      cy.wait("@getPosts");

      cy.contains(ownPost.title).should("be.visible");
      cy.contains(ownPost.content).should("be.visible");
      cy.contains(otherPost.title).should("be.visible");
    });
  });

  describe("Create", () => {
    beforeEach(() => {
      stubLogin();
      stubPosts([]);
      cy.login(TEST_EMAIL, TEST_PASSWORD);
    });

    it("should create a new post and show it in the feed", () => {
      const newPost = {
        ...ownPost,
        id: 10,
        title: "Brand New Post",
        content: "This is a fresh post",
      };

      cy.intercept("POST", "**/posts", {
        statusCode: 201,
        body: newPost,
      }).as("createPost");

      cy.intercept("GET", "**/posts*", {
        statusCode: 200,
        body: { posts: [newPost], total: 1, page: 1, limit: 10 },
      }).as("getPostsAfterCreate");

      cy.visit("/feed");

      cy.get('input[placeholder="Título"]').type(newPost.title);
      cy.get('textarea[placeholder="E aí, o que está rolando?"]').type(
        newPost.content,
      );

      cy.contains("button", "Postar").click();

      cy.wait("@createPost");
      cy.wait("@getPostsAfterCreate");

      cy.contains(newPost.title).should("be.visible");
      cy.contains(newPost.content).should("be.visible");
    });
  });

  describe("Update", () => {
    beforeEach(() => {
      stubLogin();
      stubPosts([ownPost]);
      cy.login(TEST_EMAIL, TEST_PASSWORD);
    });

    it("should edit an own post and show the updated content", () => {
      const updatedTitle = "Updated Title";
      const updatedContent = "Updated content here";

      cy.intercept("PUT", `**/posts/${ownPost.id}`, {
        statusCode: 200,
        body: { success: true },
      }).as("updatePost");

      cy.visit("/feed");
      cy.wait("@getPosts");

      cy.intercept("GET", "**/posts*", {
        statusCode: 200,
        body: {
          posts: [{ ...ownPost, title: updatedTitle, content: updatedContent }],
          total: 1,
          page: 1,
          limit: 10,
        },
      }).as("getPostsAfterUpdate");

      cy.get('button[title="Editar"]').click();

      cy.get('[data-testid="edit-title-input"]').clear().type(updatedTitle);
      cy.get('[data-testid="edit-content-input"]').clear().type(updatedContent);

      cy.contains("button", "Salvar").click();

      cy.wait("@updatePost");
      cy.wait("@getPostsAfterUpdate");

      cy.contains(updatedTitle).should("be.visible");
      cy.contains(updatedContent).should("be.visible");
    });

    it("should cancel editing and revert to original content", () => {
      cy.visit("/feed");
      cy.wait("@getPosts");

      cy.get('button[title="Editar"]').click();

      cy.get('[data-testid="edit-title-input"]')
        .clear()
        .type("Temporary title");

      cy.contains("button", "Cancelar").click();

      cy.contains(ownPost.title).should("be.visible");
      cy.contains(ownPost.content).should("be.visible");
    });
  });

  describe("Delete", () => {
    beforeEach(() => {
      stubLogin();
      stubPosts([ownPost]);
      cy.login(TEST_EMAIL, TEST_PASSWORD);
    });

    it("should delete an own post and remove it from the feed", () => {
      cy.intercept("DELETE", `**/posts/${ownPost.id}`, {
        statusCode: 200,
        body: { success: true },
      }).as("deletePost");

      cy.visit("/feed");
      cy.wait("@getPosts");

      cy.contains(ownPost.title).should("be.visible");

      cy.intercept("GET", "**/posts*", {
        statusCode: 200,
        body: { posts: [], total: 0, page: 1, limit: 10 },
      }).as("getPostsAfterDelete");

      cy.get('button[title="Deletar"]').click();

      cy.wait("@deletePost");
      cy.wait("@getPostsAfterDelete");

      cy.contains(ownPost.title).should("not.exist");
    });

    it("should not show edit/delete buttons on posts owned by another user", () => {
      stubPosts([otherPost]);

      cy.visit("/feed");
      cy.wait("@getPosts");

      cy.contains(otherPost.title).should("be.visible");

      cy.get('button[title="Editar"]').should("not.exist");
      cy.get('button[title="Deletar"]').should("not.exist");
    });
  });
});
