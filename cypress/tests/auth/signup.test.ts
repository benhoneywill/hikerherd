import faker from "@faker-js/faker";

describe("SignupPage", () => {
  it("errors if the username is taken", () => {
    cy.visit("/signup").wait(100);

    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.findByLabelText(/email/i).type(faker.internet.email());
      cy.findByLabelText(/username/i).type(user.username);
      cy.findByLabelText(/password/i).type(faker.random.alphaNumeric(12));
      cy.findAllByRole("button", { name: /join hikerherd/i }).click();

      cy.findByText(/username is already being used/i).should("exist");
    });
  });

  it("creates new account", () => {
    cy.visit("/signup").wait(100);

    cy.findByLabelText(/email/i).type(faker.internet.email());
    cy.findByLabelText(/username/i).type(faker.random.word());
    cy.findByLabelText(/password/i).type(faker.random.alphaNumeric(12));
    cy.findAllByRole("button", { name: /join hikerherd/i })
      .click()
      .wait(200);

    cy.location("pathname").should("equal", "/start");
    cy.findByText(/welcome to hikerherd/i).should("exist");
  });
});
