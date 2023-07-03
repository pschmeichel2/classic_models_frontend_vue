describe('order entry', () => {

    it('creates an order', () => {
        cy.log('Order list');
        cy.visit('/orders');    
        cy.get("#header").contains('Orders');

        // add order
        cy.log('Order entry');
        cy.get("#newOrder").click();
        cy.get("#header").contains('Order Entry');
        cy.get("#customername").should('be.empty');

        // select customer
        cy.get("#findCustomer").click();
        cy.get("[id=header]").contains('Find Customer');

        cy.get("#find").click();
        cy.get('.v-data-footer__pagination').contains('1-');

        cy.get("[id=ok]").click();
        cy.get("#header").contains('Order Entry');
        //cy.get("#customername").should('have.value', 'Atelier graphique');
        cy.get("#customername").invoke('val').should('not.be.empty');
        let customername;
        cy.get('#customername').then(($input) => {
            let customername = String($input.val());                                  
            cy.log('customername='+customername);
          })

        // add first order detail
        cy.get("#newOrderDetail").click();
        cy.get("[id=header]").contains('Add Order Detail');
        cy.get("#productNameAddOrderDetail").should('be.empty');

        // select product for order detail
        cy.get("#findProductForOrderDetail").click();
        cy.get("[id=header]").contains('Find Product');
        
        cy.get("#findproduct").click();
        cy.get('.v-data-footer__pagination').contains('1-');

        cy.get("[id=okProductSearch]").click();
        cy.get("[id=header]").contains('Add Order Detail');
        cy.get("#productNameAddOrderDetail").invoke('val').should('not.be.empty');
        cy.get("#quantityAddOrderDetail").should('have.value', '1');
        
        cy.get("#quantityAddOrderDetail").type('10');        
        cy.get("[id=okAddOrderDetail]").click();
        cy.get("#header").contains('Order Entry');
        cy.get('.v-data-footer__pagination').contains('1-1');

        // add second order detail
        cy.get("#newOrderDetail").click();
        cy.get("[id=header]").contains('Add Order Detail');

        cy.get("#findProductForOrderDetail").click();
        cy.get("[id=header]").contains('Find Product');
        
        // search for planes
        cy.get("[id=productLine]").type('Planes{enter}',{force:true});
        cy.get("#findproduct").click();
        cy.get('.v-data-footer__pagination').contains('1-');        
        cy.get("#productSearchTable tbody > :nth-child(1) > :nth-child(4)").contains('Planes'); 

        cy.get("[id=okProductSearch]").click();
        cy.get("[id=header]").contains('Add Order Detail');

        cy.get("[id=okAddOrderDetail]").click();
        cy.get("#header").contains('Order Entry');
        cy.get('.v-data-footer__pagination').contains('1-2');

        // save order 
        cy.get("#saveOrder").click();        
        cy.get("#header").contains('Order ');
        
        cy.get('#orderViewCustomerName').should(($input) => {
            const val = String($input.val());                      
            expect(val).to.include(customername);            
        })
        cy.get('.v-data-footer__pagination').contains('1-2');
    })

})

