describe("Settings", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('12345');
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('a[data-tooltip-target="tooltip-settings"]').click();
    });

    it("Navbar still visible", ()=> {
        function navBarChecks(href, contain){
            cy.get('#default-sidebar a[href="'+href+'"]')
                .should('be.visible')
                .and('contain', contain);
        }

        cy.url().should("include", "/settings")

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



    it('Setting submenu visible and correct links', () => {
        function subMenuChecker(tab, contain){
            cy.get('a[href="?tab='+tab+'"]')
                .should('be.visible')
                .and('contain', contain)
        }

        subMenuChecker("general", "General Settings")
        subMenuChecker("subusers", "Organizations")
        subMenuChecker("integrations", "Data Products")
    })

    it("Setting submenu has button", ()=> {
        function buttonChecker(tab){
            cy.get('a[href="?tab='+tab+'"]').click()
            cy.get('button[type=submit]').should('exist')
            cy.url().should("include", tab)
            cy.get('a[data-tooltip-target="tooltip-settings"]').click();
        }

        buttonChecker("general")
        //buttonChecker("subusers") --waiting for response
        buttonChecker("integrations")
    })

    it('Settings - Organizations - add new organizations', ()=> {
        cy.get('a[href="?tab=subusers"]').click()
        cy.contains('Add a new organization').click();
        cy.contains('Create a new Organization').should('be.visible')
        cy.contains('Orgnization Name').should("be.visible")
        cy.contains('Create orgnization').should("be.visible")
        cy.get('input[name="name"]').should("be.visible")
    })
})