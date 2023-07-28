describe('Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
    cy.get('input[name=password]').type('12345');
    cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
    });

    it('renders Sidebar with links', () => {
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
        
    });

    it('renders page header', () => {
        cy.get('h1') // Assuming the PageHeader component renders a <header> element.
            .should('be.visible');
    
    });
    
    it('setting page button works', () => {
        cy.get('a[data-tooltip-target="tooltip-settings"].inline-flex.justify-center.p-2.text-black.rounded.cursor-pointer.dark\\:text-white.dark\\:hover\\:text-white.hover\\:text-gray-900.hover\\:bg-gray-100.dark\\:hover\\:bg-gray-600[href="/settings"]').click();
        cy.url().should("include", "/setting")
    })
});
