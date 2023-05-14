describe("In game tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006");
    cy.get("input#usernameInput").type("Mathis");
    cy.get("input#passwordInput").type("Mathis");
    cy.contains("Se connecter").click();
    cy.contains("Consulter mes parties").click();
    cy.get('[data-testid="listGames"]').contains("Partie n˚").click();
    cy.contains("Je lance la partie").click();
    cy.contains("Fermer").click();
  });

  it("Assert display is correct", () => {
    cy.contains("Mathis").should("exist");
    cy.contains("Menu").should("exist");
    cy.get("#disconnectButton").should("exist");
    cy.get('[data-testid="gameHeaderIcon"]').should("exist");
    cy.get('[data-testid="gameHeaderTimer"]').should("exist");
    cy.get('[data-testid="messageInput"]')
      .invoke("attr", "placeholder")
      .should("contain", "Type a message");
    cy.get('[data-testid="sendMessage"]').should("exist");
  });

  it("Try sending a message", () => {
    const messageText = Date.now().toString() + "myMess4ge";

    cy.get('[data-testid="messageInput"]').focus().type(messageText);

    cy.get('[data-testid="sendMessage"]').click();
    cy.get('[data-testid="messageInput"]').should("have.value", "");
    cy.contains(messageText).should("exist");
  });

  it("Opening the menu", () => {
    cy.get('[data-testid="inGameMenuOpen"]').click();
    cy.contains("Infos partie").should("exist");
    cy.contains("Votes").should("exist");
    cy.contains("Pouvoir").should("exist");
    cy.contains("Règles du jeu").should("exist");
    cy.get('[data-testid="closeInGameMenu"]').click();
    cy.contains("Règles du jeu").should("not.exist");
    
  })
});
