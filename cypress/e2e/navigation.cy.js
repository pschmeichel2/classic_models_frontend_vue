describe('navigation master-detail-detail-master', () => {
  
  it('navigates from offices to employees and back', () => {
    cy.log('Office list'); 
    cy.visit('/offices');    
    cy.get('.v-data-footer__pagination').contains('1-7 of 7');

    cy.log('Office Detail');         
    cy.get('tbody > :nth-child(3)').click();    
    cy.get("#header").contains('Office 3 (NYC)');
    cy.get('.v-data-footer__pagination').contains('1-2 of 2');
    cy.get('#subheader').contains('Employees');

    cy.log('Employee Detail');    
    cy.get('tbody > :nth-child(1)').click();    
    cy.get("#header").contains('Employee 1286');
    cy.get('.v-data-footer__pagination').contains('1-7 of 7');
    cy.get('#subheader').contains('Customers');
    
    cy.log('Back to Office Detail');
    cy.get('#officelink').click();
    cy.get("#header").contains('Office 3 (NYC)');
  })
  
})