describe('template spec', () => {

  it('displays the home page', () => {
    const baseurl = Cypress.env('baseurlApp');
    cy.visit(baseurl);
  })

  it('displays offices', () => {
    const baseurlService = Cypress.env('baseurl')+'/offices';
    const baseurlApp = Cypress.env('baseurlApp')+'/offices';
    cy.intercept('GET', baseurlService, { fixture: 'offices.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-7 of 7');
  })

  it('displays employees', () => {
    const baseurlService = Cypress.env('baseurl')+'/employees';
    const baseurlApp = Cypress.env('baseurlApp')+'/employees';
    cy.intercept('GET', baseurlService, { fixture: 'employees.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays customers', () => {
    const baseurlService = Cypress.env('baseurl')+'/customers';
    const baseurlApp = Cypress.env('baseurlApp')+'/customers';
    cy.intercept('GET', baseurlService, { fixture: 'customers.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays orders', () => {
    const baseurlService = Cypress.env('baseurl')+'/orders';
    const baseurlApp = Cypress.env('baseurlApp')+'/orders';
    cy.intercept('GET', baseurlService, { fixture: 'orders.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays orderDetails', () => {
    const baseurlService = Cypress.env('baseurl')+'/orderDetails';
    const baseurlApp = Cypress.env('baseurlApp')+'/orderDetails';
    cy.intercept('GET', baseurlService, { fixture: 'orderDetails.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays payments', () => {
    const baseurlService = Cypress.env('baseurl')+'/payments';
    const baseurlApp = Cypress.env('baseurlApp')+'/payments';
    cy.intercept('GET', baseurlService, { fixture: 'payments.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-15');
  })

  it('displays productLines', () => {
    const baseurlService = Cypress.env('baseurl')+'/productLines';
    const baseurlApp = Cypress.env('baseurlApp')+'/productLines';
    cy.intercept('GET', baseurlService, { fixture: 'productLines.json' });        
    cy.visit(baseurlApp);
    cy.get('div .v-data-footer__pagination').contains('1-7');
  })

})