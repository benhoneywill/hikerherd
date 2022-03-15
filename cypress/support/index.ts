import "./commands";

before(() => {
  cy.task("db:reset");
});

beforeEach(() => {
  cy.task("db:reset");
});
