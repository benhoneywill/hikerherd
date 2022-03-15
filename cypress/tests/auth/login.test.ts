import faker from "@faker-js/faker";

describe("LoginPage", () => {
  it("shows an error with an email that doesnt exist", () => {
    const email = faker.internet.email();
    const password = faker.random.alphaNumeric(12);

    cy.visit("/login").wait(100);

    cy.findByLabelText(/email/i).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findAllByRole("button", { name: /log in/i }).click();

    cy.findByText(/wrong email or password/i).should("exist");
  });

  it("logs in with valid credentials", () => {
    const password = faker.random.alphaNumeric(12);

    cy.visit("/login").wait(100);

    cy.task("factory", { name: "createUser", values: { password } }).then(
      (user) => {
        cy.findByLabelText(/email/i).type(user.email);
        cy.findByLabelText(/password/i).type(password);
        cy.findAllByRole("button", { name: /Log in/i }).click();

        cy.location("pathname").should("equal", "/");
        cy.findByText(/welcome back/i).should("exist");
      }
    );
  });
});
