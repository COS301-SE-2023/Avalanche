describe("Domain Length", () => {
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort'));
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click();
        cy.wait(5000);
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort') + '/domainLength');
        
        cy.url().should('eq', Cypress.env('baseURL') + Cypress.env('basePort') + '/domainLength')
    });

    it("Navbar still visible", ()=> {
        function navBarChecks(href, contain){
            cy.get('#default-sidebar a[href="'+href+'"]')
                .should('be.visible')
                .and('contain', contain);
        }

        cy.url().should("include", "/domainLength")

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

    it.only('everything loads on DNAL', ()=> {
        cy.contains('Domain Name Analysis Length').should('be.visible')
        cy.contains('p', 'Insights at your fingertips').should('be.visible');
        cy.get('canvas[role="img"]').should('be.visible'); //graph itself
        cy.get('h1').should(($h1Elements) => { //headings
            expect($h1Elements).to.have.length.above(1);
            expect($h1Elements).to.be.visible;
          });
    })



})