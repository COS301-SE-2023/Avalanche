describe.skip("Settings", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('12345');
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('a[data-tooltip-target="tooltip-settings"]').click();
    });

    it.skip("Navbar still visible", ()=> {
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



    it.skip('Setting submenu visible and correct links', () => {
        function subMenuChecker(tab, contain){
            cy.get('a[href="?tab='+tab+'"]')
                .should('be.visible')
                .and('contain', contain)
        }

        subMenuChecker("general", "General Settings")
        subMenuChecker("subusers", "Organizations")
        subMenuChecker("integrations", "Data Products")
    })

    it.skip("Setting submenu has button", ()=> {
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

    it.skip('Settings - Organizations - add new organizations', ()=> {
        cy.get('a[href="?tab=subusers"]').click()
        cy.contains('Add a new organization').click();
        cy.contains('Create a new Organization').should('be.visible')
        cy.contains('Orgnization Name').should("be.visible")
        cy.contains('Create orgnization').should("be.visible")
        cy.get('input[name="name"]').should("be.visible")
    })

    
})

describe('Settings with another user', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('u21804312@tuks.co.za');
        cy.get('input[name=password]').type('12345');
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('a[data-tooltip-target="tooltip-settings"]').click();
    })

    it.skip('After organization has been created', () => {
        cy.get('a[href="?tab=subusers"]').click()
        cy.contains('TestB').should('be.visible');
        cy.contains('Administrators').should('be.visible');
        cy.contains('Create a Group').should('be.visible');
        cy.contains('Add User to Group').should('be.visible');

    })

    it('everything loads with Create Group button', () => {
        cy.get('a[href="?tab=subusers"]').click() //clicks onto Organizations tab
        cy.contains('Create a Group').click();
        cy.contains('Create a New Group').should('be.visible')
        cy.contains('Group Name').should('be.visible')
        cy.get('input[placeholder="Paper Sales"]').should('be.visible');
    })


})