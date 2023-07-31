describe("Registrar", () => {
    beforeEach(() => {
        cy.setCookie('jwt', Cypress.env('jwt'));
        cy.visit(Cypress.env('baseURL') +  Cypress.env('basePort') + '/registrar');
        cy.wait(5000);
        cy.url().should('eq',Cypress.env('baseURL') +  Cypress.env('basePort') + '/registrar' );

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
        cy.get('canvas[role="img"]').should('be.visible'); //graph itself
        cy.get('h1').should(($h1Elements) => { //headings
            expect($h1Elements).to.have.length.above(1);
            expect($h1Elements).to.be.visible;
          });
          
        
    })


})