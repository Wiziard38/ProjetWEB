import { describe, beforeEach, it, cy } from 'cypress';

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
    cy.contains("Règles du jeu").should("exist");
    cy.get('[data-testid="closeInGameMenu"]').click();
    cy.contains("Règles du jeu").should("not.exist");
  })

  it("Consulting Infos partie", () => {
    // All General informations available
    cy.get('[data-testid="inGameMenuOpen"]').click();
    cy.contains("Infos partie").click();
    cy.contains("Informations générales").should("exist");
    cy.contains("Informations de la partie").should("exist");
    cy.contains("Vos informations").should("exist");
    cy.contains("Etat courant de la partie").should("exist");
    cy.contains("Liste des joueurs").should("exist");

    // Check specific informations
    cy.contains("Informations de la partie").click();
    cy.contains("Numéro partie").should("exist");
    cy.contains("Nombre de joueurs").should("exist");
    cy.contains("Duree du jour :").should("exist");
    cy.contains("Duree de la nuit :").should("exist");
    cy.contains("Date de debut :").should("exist");
    cy.contains("Probabilité de pouvoir :").should("exist");
    cy.contains("Nombre de loup-garous").should("exist");

    cy.contains("Vos informations").click();
    cy.contains("Vous êtes :").should("exist");
    cy.contains("Vous avez le pouvoir :").should("exist");

    cy.contains("Etat courant de la partie").click();
    cy.contains("Phase de jeu :").should("exist");
    cy.contains("Temps restant avant changement de phase :").should("exist");

    cy.contains("Liste des joueurs").click();
  });

  it("Vote menu displays correctly", () => {
    // All General informations available
    cy.get('[data-testid="inGameMenuOpen"]').click();
    cy.contains("Votes").click();
    cy.contains("Créer un nouveau vote").should("exist");
    cy.contains(
      "Vous souhaitez créer un nouveau vote contre un joueur ?"
    ).should("exist");
    cy.contains("Ratifier un vote existant").should("exist");
    cy.contains("Vous souhaitez ratifier un vote déjà existant ?").should(
      "exist"
    );
    cy.contains("Choisir un joueur").should("exist");
    cy.contains("Vote contre [choisir]").should("exist");
  });
});
