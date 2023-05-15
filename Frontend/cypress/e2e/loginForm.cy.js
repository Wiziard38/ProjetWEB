import { describe, beforeEach, it, cy } from 'cypress';

describe("Verification of the LoginForm errors", () => {
  beforeEach(() => {
    cy.visit("http://localhost:19006");
  });

  it("should display the login form correctly", () => {
    cy.get("input#usernameInput").should("exist");
    cy.get("input#passwordInput").should("exist");
    cy.contains("Se connecter").should("exist");
    cy.contains("Je m'inscris").should("exist");
  });

  it("should switch between login and sign up modes", () => {
    cy.contains("Je m'inscris").click();
    cy.contains("S'inscrire").should("exist");
    cy.contains("Je me connecte").should("exist");

    cy.contains("Je me connecte").click();
    cy.contains("Se connecter").should("exist");
    cy.contains("Je m'inscris").should("exist");
  });

  it("should display an error message when submitting an empty form", () => {
    cy.contains("Se connecter").click();

    cy.get("input#usernameInput")
      .invoke("attr", "placeholder")
      .should("contain", "Username : ce champ est requis");

    cy.get("input#passwordInput")
      .invoke("attr", "placeholder")
      .should("contain", "Password : ce champ est requis");
  });

  it("should display an error message when username is too long", () => {
    cy.get("input#usernameInput").type(
      "this_is_a_very_long_username_that_exceeds_the_maximum_length_allowed"
    );
    cy.get("input#passwordInput").type("test");
    cy.contains("Se connecter").click();
    cy.contains("L'username est trop long !").should("exist");
  });

  it("should display an error message when password is too long", () => {
    cy.get("input#usernameInput").type("test");
    cy.get("input#passwordInput").type(
      "this_is_a_very_long_password_that_exceeds_the_maximum_length_allowed_for_passwords"
    );
    cy.contains("Se connecter").click();
    cy.contains("Le password est trop long !").should("exist");
  });

  it("Cannot create account if existing username", () => {
    cy.contains("Je m'inscris").click();
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1");
    cy.contains("S'inscrire").click();
    cy.contains("Username already exists").should("exist");
  });

  it("Enter a wrong password", () => {
    cy.get("input#usernameInput").type("1bis");
    cy.get("input#passwordInput").type("1");
    cy.contains("Se connecter").click();
    cy.contains("Username ou mot de passe incorrect").should("exist");
  });

  it("Enter a wrong username", () => {
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1bis");
    cy.contains("Se connecter").click();
    cy.contains("Username ou mot de passe incorrect").should("exist");
  });

  it("Connection successfull", () => {
    cy.get("input#usernameInput").type("1");
    cy.get("input#passwordInput").type("1");
    cy.contains("Se connecter").click();
    cy.contains("Consulter de nouvelles parties").should("exist");
  });

  it("Connection successfull", () => {
    const newUserName = Date.now().toString() + "reinforcedUnique";
    cy.contains("Je m'inscris").click();
    cy.get("input#usernameInput").type(newUserName);
    cy.get("input#passwordInput").type("fewfjjkflewh");
    cy.contains("S'inscrire").click();
    cy.contains(
      `Bienvenue ${newUserName}, vous avez été inscrit avec succès.`
    ).should("exist");
  });
});
