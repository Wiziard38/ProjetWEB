describe('Tag tests', () => {
  it('Modify Tag', () => {
    cy.visit('http://localhost:3000/frontend')
    // Variable pour se souvenir de quel tag a été cliqué
    let tagId

    // On clique sur tags
    cy.get("#menu .tags").wait(200).click()
  
    // Selection du premier tag
    const tag = cy.get("#items div:first-child")
    tag.click()

    // Permet de récupérer par la suite quel tag a été cliqué
    tag
      .invoke('attr', 'num')
      .as('tagId')
      .then(($tagId) => {
        tagId = $tagId
      })

    // Modification du nom
    const newTagName = Date.now() // Nom qui sera forcement unique
    cy.get('#items .selected form input:first-child').clear().type(newTagName)

    // Soumission
    cy.get("#items .selected form input[value='Modify name']").click()

    // Verification modification
    cy.get('@tagId').then(() => 
      {cy.get("#items div[num='" + tagId + "'] h2").should('have.text', newTagName)})
  })

  it('List Users', () => {
    cy.visit('http://localhost:3000/frontend')

    // On clique sur tags
    cy.get("#menu .users").wait(200).click()
  
    // Ajout d'un user
    const newUserName = Date.now()
    cy.get("#add .users input[name='username']").type(newUserName)
    cy.get("#addUser").click()

    cy.contains(newUserName)
    
  })
})