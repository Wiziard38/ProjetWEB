describe("Display of the selection menu once connected", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006");
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1");
    cy.contains("Se connecter").click();
  });

  it("Should display page correctly", () => {
    cy.contains("1").should("exist");
    cy.contains("Consulter de nouvelles parties").should("exist");
    cy.contains("Consulter mes parties").should("exist");
    cy.contains("Créer une nouvelle partie").should("exist");
  });

  it("Should disconnect successfully", () => {
    cy.get("input#passwordInput").should("not.exist");
    cy.get("#disconnectButton").click();
    cy.get("input#passwordInput").should("exist");
  });

  it("First menu should display correctly", () => {
    cy.contains("Consulter de nouvelles parties").click();
    cy.contains("Liste des parties que vous pouvez rejoindre :").should(
      "exist"
    );
    cy.contains("Menu").should("exist");
    cy.contains("Menu").click();
    cy.contains("Consulter de nouvelles parties").should("exist");
  });

  it("Second menu should display correctly", () => {
    cy.contains("Consulter mes parties").click();
    cy.contains(
      "Liste des parties auxquelles vous êtes en cours de participation : "
    ).should("exist");
    cy.contains("Menu").should("exist");
    cy.contains("Menu").click();
    cy.contains("Consulter de nouvelles parties").should("exist");
  });

  it("Third menu should display correctly", () => {
    cy.contains("Créer une nouvelle partie").click();
    cy.contains("Nombre de joueurs").should("exist");
    cy.contains("Durée d'un jour :").should("exist");
    cy.contains("Durée d'une nuit :").should("exist");
    cy.contains("La partie commencera le :").should("exist");
    cy.contains("Probabilité d'apparition d'un loup").should("exist");
    cy.contains("Probabilité d'obtention d'un pouvoir").should("exist");
    cy.contains("Créer la partie").should("exist");
    cy.contains("Menu").should("exist");
    cy.contains("Menu").click();
    cy.contains("Consulter de nouvelles parties").should("exist");
  });
});


describe("Checking creation and joining games", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006");
  });

  it("Create a new game successfull", () => {
    // We connect first
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1");
    cy.contains("Se connecter").click();

    // Then create new game
    cy.contains("Créer une nouvelle partie").click();
    cy.contains("Créer la partie").click();
    cy.contains("La partie a été créée avec succès !").should("exist");
    cy.contains("Fermer").click();
  });

  it("Join a new game successfully", () => {
    // We connect to a new account
    const newUserName = Date.now().toString() + "Secr3tH4shUnlque";
    cy.contains("Je m'inscris").click();
    cy.get("input#usernameInput").type(newUserName);
    cy.get("input#passwordInput").type("1");
    cy.contains("S'inscrire").click();
    cy.contains("Fermer").click();

    // We join game created beforehand
    cy.contains("Consulter de nouvelles parties").click();
    cy.get('[data-testid="listGames"]').should("exist");
    cy.get('[data-testid="listGames"]').contains("Partie n˚").click();
    cy.contains("Nombre de joueurs :").should("exist");
    cy.contains("Duree du jour :").should("exist");
    cy.contains("Duree de la nuit :").should("exist");
    cy.contains("Date de debut :").should("exist");
    cy.contains("Probabilité de pouvoir :").should("exist");
    cy.contains("Probabilité de loup-garou :").should("exist");
    cy.contains("Je rejoins !").should("exist");
    cy.contains("Je rejoins !").click();
    cy.contains("Vous vous êtes inscrit avec succès à la partie");
    cy.contains("Fermer").click();
  });

  it("Launch one of my games", () => {
    // We connect first
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1");
    cy.contains("Se connecter").click();

    // Then go to my games
    cy.contains("Consulter mes parties").click();
    cy.get('[data-testid="listGames"]').contains("Partie n˚").click();
    cy.contains("Nombre de joueurs :").should("exist");
    cy.contains("Duree du jour :").should("exist");
    cy.contains("Duree de la nuit :").should("exist");
    cy.contains("Date de debut :").should("exist");
    cy.contains("Probabilité de pouvoir :").should("exist");
    cy.contains("Probabilité de loup-garou :").should("exist");
    cy.contains("Je lance la partie").should("exist");
    cy.contains("Je lance la partie").click();
    cy.contains("Vous rejoignez la partie 2. Bon jeu !");
    cy.contains("Fermer").click();
  });
});
