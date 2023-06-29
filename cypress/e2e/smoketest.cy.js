describe('template spec', () => {

  it('displays the home page', () => {
    // Arrange
    const baseurl = Cypress.env('baseurlApp');
    // Act, Assert
    cy.visit(baseurl);
  })

  it('displays offices', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/offices';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-7 of 7');
  })

  it('displays employees', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/employees';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays customers', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/customers';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays orders', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/orders';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays orderDetails', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/orderDetails';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays payments', () => {
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/payments';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays productLines', () => {
    // Arrange  
    const baseurlApp = Cypress.env('baseurlApp')+'/productLines';  
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-7');
  })

})