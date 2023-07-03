describe('mainmenu clicks', () => {

  beforeEach(() => {
    cy.visit('/');  
    cy.get("#header").contains('Welcome to Classic Models');
    // click on menu button
    cy.get('.v-app-bar__nav-icon > .v-btn__content > .v-icon').click();  
  })
  
  it('navigates to offices', () => {    
    cy.get('[href="/offices"]').click();
    cy.get("#header").contains('Offices');
  })
  
  it('navigates to employees', () => {        
    cy.get('[href="/employees"]').click();
    cy.get("#header").contains('Employees');
  })
    
  it('navigates to customers', () => {    
    cy.get('[href="/customers"]').click();
    cy.get("#header").contains('Customers');
  })
    
  it('navigates to orders', () => {    
    cy.get('[href="/orders"]').click();
    cy.get("#header").contains('Orders');
  })

  it('navigates to order details', () => {    
    cy.get('[href="/orderDetails"]').click();
    cy.get("#header").contains('Order Details');
  })
    
  it('navigatesto payments', () => {    
    cy.get('[href="/payments"]').click();
    cy.get("#header").contains('Payments');
  })

  it('navigates to product lines', () => {    
    cy.get('[href="/productLines"]').click();
    cy.get("#header").contains('Product Lines');
  })
    
  it('navigates to products', () => {    
    cy.get('[href="/products"]').click();
    cy.get("#header").contains('Products');  
  })

})

  
