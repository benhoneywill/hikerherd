describe("PackSharePage", () => {
  it("show the shared pack", () => {
    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.task("factory", {
        name: "createPack",
        values: { userId: user.id },
      }).then((pack) => {
        cy.visit(`/packs/share/${pack.id}`).wait(100);
        cy.findByText(pack.name).should("exist");
      });
    });
  });

  it("does not show the pack if private", () => {
    cy.task("factory", { name: "createUser", values: {} }).then((user) => {
      cy.task("factory", {
        name: "createPack",
        values: { userId: user.id, private: true },
      }).then((pack) => {
        cy.visit(`/packs/share/${pack.id}`, { failOnStatusCode: false }).wait(
          100
        );
        cy.findByRole("heading", { name: /not found/i }).should("exist");
      });
    });
  });
});
