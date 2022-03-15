import faker from "@faker-js/faker";

describe("ProfilePage", () => {
  it("shows the users profile", () => {
    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.visit(`/user/${user.username}`).wait(100);

      cy.findByText(user.username).should("exist");
    });
  });

  it("does not show the change avatar button if not logged in", () => {
    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.visit(`/user/${user.username}`).wait(100);
      cy.findByText(/change avatar/i).should("not.exist");
    });
  });

  it("does not show the change avatar button if not your own profile", () => {
    const password = faker.random.alphaNumeric(12);

    cy.task("factory", { name: "createUser", values: { password } }).then(
      (currentUser) => {
        cy.login({
          email: currentUser.email,
          password,
        });
      }
    );

    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.visit(`/user/${user.username}`).wait(100);
      cy.findByText(/change avatar/i).should("not.exist");
    });
  });

  it("should show the change avatar button if it is your own profile", () => {
    const password = faker.random.alphaNumeric(12);

    cy.task("factory", { name: "createUser", values: { password } }).then(
      (currentUser) => {
        cy.login({ email: currentUser.email, password });
        cy.visit(`/user/${currentUser.username}`).wait(100);
        cy.findByText(/change avatar/i).should("exist");
      }
    );
  });
});
