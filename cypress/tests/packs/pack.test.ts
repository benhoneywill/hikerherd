import faker from "@faker-js/faker";

describe("PackPage", () => {
  it("should redirect to login if not logged in", () => {
    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.task("factory", {
        name: "createPack",
        values: { userId: user.id },
      }).then((pack) => {
        cy.visit(`/packs/${pack.id}`, { failOnStatusCode: false }).wait(100);
        cy.findByRole("heading", { name: /log in/i }).should("exist");
      });
    });
  });

  it("does not show the pack if it does not belong to the user", () => {
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
      cy.task("factory", {
        name: "createPack",
        values: { userId: user.id, private: true },
      }).then((pack) => {
        cy.visit(`/packs/${pack.id}`, { failOnStatusCode: false }).wait(100);
        cy.findByRole("heading", { name: /not found/i }).should("exist");
      });
    });
  });

  it("shows the pack if it belongs to the user", () => {
    const password = faker.random.alphaNumeric(12);

    cy.task("factory", { name: "createUser", values: { password } }).then(
      (currentUser) => {
        cy.login({
          email: currentUser.email,
          password,
        }).then(() => {
          cy.task("factory", {
            name: "createPack",
            values: { userId: currentUser.id, private: true },
          }).then((pack) => {
            cy.visit(`/packs/${pack.id}`, { failOnStatusCode: false }).wait(
              100
            );
            cy.findByText(/not found/).should("not.exist");
          });
        });
      }
    );
  });
});
