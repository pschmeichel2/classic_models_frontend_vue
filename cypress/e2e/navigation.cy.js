describe('template spec', () => {

  
  it('navigates from offices to employees and back', () => {
    // Office list
    // Arrange    
    const baseurlApp = Cypress.env('baseurlApp')+'/offices';    
    // Act
    cy.visit(baseurlApp);
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-7 of 7');

    // Office Detail    
    // Act
    cy.get('tbody > :nth-child(3) > :nth-child(2)').click();
    // Assert
    cy.get("#header").contains('Office 3 (NYC)');
    cy.get('div .v-data-footer__pagination').contains('1-2 of 2');
    cy.get('#subheader').contains('Employees');

    // Employee Detail
    // Act
    cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
    // Assert
    cy.get("#header").contains('Employee 1286');
    cy.get('div .v-data-footer__pagination').contains('1-7 of 7');
    cy.get('#subheader').contains('Customers');
    
    // Back to Office Detail
    cy.get(':nth-child(1) > .v-input > .v-input__prepend-outer > .v-input__icon > .v-icon').click();
    cy.get("#header").contains('Office 3 (NYC)');
  })

  
})