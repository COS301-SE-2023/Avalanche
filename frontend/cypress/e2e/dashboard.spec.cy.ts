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

    it.only('logging out works', () => {
        /* cy.get('button[class="inline-flex justify-center p-2 text-black rounded cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600"]')
             .should('be.visible')
             .click()*/

        cy.get('path[fill-rule="evenodd"][d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"]')
             .click()
        cy.contains('Sign in to your account').should('be.visible')
        cy.contains('Your email').should('be.visible')
        cy.get('input[placeholder="name@company.com"]').should('be.visible');
        cy.contains('Password').should('be.visible')
        cy.get('input[placeholder="••••••••"]').should('be.visible');
        cy.contains('Forgot password').should('be.visible')
        cy.contains('Don\'t have an account yet?').should('be.visible')
        cy.contains('Sign in').should('be.visible')
        cy.contains('Avalanche Analytics').should('be.visible')

    })
});
