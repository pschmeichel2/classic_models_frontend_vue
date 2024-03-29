import OfficeView from './../../src/views/DetailViews/OfficeView.vue';


describe('<OfficeView />', () => {
  it('renders and displays mocked REST data', () => {
    
    // Arrange
    const officeCode = Cypress.env('officeCode');    
    const baseurl = Cypress.env('baseurl');
    const officeUrl = baseurl + '/offices/' + officeCode;
    const employeeUrl = baseurl + '/offices/' + officeCode + "/employees";

    cy.intercept('GET', officeUrl, { fixture: 'office-3.json' });
    cy.intercept('GET', employeeUrl, { fixture: 'office-3-employees.json' });
    
    // Act
    cy.mount(OfficeView, {props: { officeCode:officeCode},});
    
    // Assert
    cy.get("#header").contains('Office 3 (New York)');
    cy.get("#city").should('have.value', 'New York');
    cy.get('div .v-data-footer__pagination').contains('1-2 of 2');
    cy.get("#employeeTable tbody > :nth-child(1) > :nth-child(1)").contains('1286'); 
    cy.get("#employeeTable tbody > :nth-child(1) > :nth-child(2)").contains('Tseng'); 
  })

  it('has links to employees', () => {
    
    // Arrange
    const officeCode = Cypress.env('officeCode');    
    const baseurl = Cypress.env('baseurl');
    const officeUrl = baseurl + '/offices/' + officeCode;
    const employeeUrl = baseurl + '/offices/' + officeCode + "/employees";

    cy.intercept('GET', officeUrl, { fixture: 'office-3.json' });
    cy.intercept('GET', employeeUrl, { fixture: 'office-3-employees.json' });
    
    // Act
    cy.mount(OfficeView, {props: { officeCode:officeCode},});
    // Assert
    cy.get('div .v-data-footer__pagination').contains('1-2 of 2');
    // Act
    cy.get('tbody > :nth-child(2) > :nth-child(2)').click();
    // Assert
    cy.on("url:changed", (newUrl) => {
      expect(newUrl).to.contain("/employees/1323");
    })
  })

})