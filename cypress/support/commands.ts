import "@testing-library/cypress/add-commands";

Cypress.Commands.add("login", ({ email, password }) => {
  return cy.request("POST", "/api/rpc/login-mutation", {
    params: {
      email,
      password,
    },
  });
});
