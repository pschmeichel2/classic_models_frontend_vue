describe('smoketest - open list views via url, navigate to details', () => {

  it('displays the home page', () => {    
    cy.visit('/');
    cy.get("#header").contains('Welcome to Classic Models');
  })

  it('displays offices list and navigates to office detail screeen', () => {
    cy.visit('/offices');    
    cy.get("#header").contains('Offices');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Office ');
  })

  it('displays employees list and navigates to employee detail screeen', () => {        
    cy.visit('/employees');    
    cy.get("#header").contains('Employees');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('table').find('tr').contains('td', 'Sales Rep').first().parent('tr').click(); 
    cy.get("#header").contains('Employee ');
  })

  it('displays customers list and navigates to customer detail screen', () => {        
    cy.visit('/customers');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Customer ');
  })

  it('displays orders list and navigates to order detail screen', () => {        
    cy.visit('/orders');    
    cy.get("#header").contains('Orders');
    cy.get('div .v-data-footer__pagination').contains('1-'); 
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Order ');
  })

  it('displays orderDetails list and navigates to order detail screen', () => {
    cy.visit('/orderDetails');
    cy.get("#header").contains('Order Details');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Order Detail ');    
  })

  it('displays payments list and navigates to payment detail screen', () => {      
    cy.visit('/payments');
    cy.get("#header").contains('Payments');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Payment ');        
  })

  it('displays productLines list and navigates to product line detail screen', () => {    
    cy.visit('/productLines');
    cy.get("#header").contains('Product Lines');
    cy.get('div .v-data-footer__pagination').contains('1-');
    cy.get('tbody > :nth-child(1)').click();
    cy.get("#header").contains('Product Line ');
  })

})