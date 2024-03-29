describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort')+"/");
        cy.url().should('eq', Cypress.env('baseURL')+"/");
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));  
        cy.wait(2000);
    });

    it('renders Sidebar with links', () => {
        
        cy.get('button[type=submit]').click();
        
        function navBarChecks(href, contain){
            cy.get('#default-sidebar a[href="'+href+'"]')
                .should('be.visible')
                .and('contain', contain);
        }

        cy.url().should("include", "/dashboard")

        cy.get('#default-sidebar')
            .should('be.visible');

        navBarChecks("/dashboard", "Home")
        navBarChecks("/registrar", "Registrar")
        navBarChecks("/registrarMarketComparison", "Registrar Market Comparison")
        navBarChecks("/movement", "Movement")
        navBarChecks("/domainLength", "Domain Length")
        navBarChecks("/marketShare", "Market Share")
        navBarChecks("/ageAnalysis", "Registrar Age Analysis")
        navBarChecks("/domainNameAnalysis", "Domain Name Analysis")
        navBarChecks("/watch", "Domain Watch")
        
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
        cy.get('button[type=submit]').click();
        cy.get('h1') // Assuming the PageHeader component renders a <header> element.
            .should('be.visible');

    });
    
});
