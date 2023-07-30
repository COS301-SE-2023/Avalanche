describe("Registrar", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('12345');
        cy.get('button[type=submit]').click();
        cy.get('a[id="registrar"]').click();

    });

    it("Navbar still visible", ()=> {
        function navBarChecks(href, contain){
            cy.get('#default-sidebar a[href="'+href+'"]')
                .should('be.visible')
                .and('contain', contain);
        }

        cy.url().should("include", "/registrar")

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
    })

    it.only('loads everything on Registrar page', ()=>{
        cy.contains('Registrar').should('be.visible')
        cy.contains('p', 'Insights at your fingertips').should('be.visible');
        cy.get('canvas[role="img"]').should('be.visible');
    })

})