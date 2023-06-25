describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('ingeodendaal5@gmail.com');
    cy.get('input[name=password]').type('password');
    cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
    });
    
    it('renders Sidebar with links', () => {
        it('The navigation should be visible', () => {
            cy.get('#default-sidebar')
              .should('be.visible');
          });
        
          it('Home link is visible', () => {
            cy.get('#default-sidebar a[href="/dashboard"]')
              .should('be.visible')
              .and('contain', 'Home');
          });
    });

    it('renders page header', () => {
        cy.get('h1') // Assuming the PageHeader component renders a <header> element.
            .should('be.visible');
    
    });
    
});
