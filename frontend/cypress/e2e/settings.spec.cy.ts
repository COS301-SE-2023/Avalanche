describe("Settings", () => {
    before(()=>{
        
    });
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort')+"/");
        cy.url().should('eq', Cypress.env('baseURL')+"/");
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click();
        
        cy.wait(2000);
        cy.get("a[href='/settings']",{timeout:10000}).click();
        cy.wait(2000);
        cy.url().should('eq', Cypress.env('baseURL') + Cypress.env('basePort') + '/settings');
        cy.wait(2000);
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
        subMenuChecker("organizations", "Organizations")
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
        buttonChecker("organizations")
        buttonChecker("integrations")
    })

    //need to add "everything loads" for General Settings because frontend fucky=============

    it('Settings - Organizations - add new organizations', ()=> {
        cy.get('a[href="?tab=organizations"]').click()
        cy.contains('Add a new organization').click();
        cy.wait(3000);
        cy.contains('Create',{timeout:10000}).should('be.visible')
        cy.contains('Orgnization Name').should("be.visible")
        cy.contains('Create orgnization').should("be.visible")
        cy.get('input[name="name"]').should("be.visible")
    })

    
})

// describe('Settings with another user', () => {
//     beforeEach(() => {
//         cy.wait(1000);
//         cy.visit(Cypress.env('baseURL') + Cypress.env('basePort'));
//         cy.get('input[name=email]').type('u21804312@tuks.co.za');
//         cy.get('input[name=password]').type('12345');
      
//         cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        
//         cy.wait(5000);
//         cy.get("a[href='/settings']",{timeout:10000}).click();
//         cy.wait(2000);
//         cy.url().should('eq', Cypress.env('baseURL') + Cypress.env('basePort') + '/settings');
//         cy.wait(2000);
//     })

//     it('After organization has been created', () => {
//         cy.get('a[href="?tab=organizations"]').click()
//         cy.contains('TestB').should('be.visible');
//         cy.contains('Administrators').should('be.visible');
//         cy.contains('Create a Group').should('be.visible');
//         cy.contains('Add User to Group').should('be.visible');

//     })

//     it('everything loads with Create Group button', () => {
//         cy.get('a[href="?tab=organizations"]').click() //clicks onto Organizations tab
//         cy.contains('Create a Group').click();
//         cy.contains('Create a New Group').should('be.visible')
//         cy.contains('Group Name').should('be.visible')
//         cy.get('input[placeholder="Paper Sales"]').should('be.visible');
//     })

//     it('everything loads with Add User to Group button', () => {
//         cy.get('a[href="?tab=subusers"]').click()
//         cy.contains('Add User to Group ').click();
//         cy.contains('Add a User to a Group').should('be.visible');
//         cy.contains('Group Name').should('be.visible');
//         cy.get('input[placeholder="Paper Sales"]').should('be.visible');
//         cy.contains('User Email').should('be.visible');
//         cy.get('input[placeholder="john@example.com"]').should('be.visible');
//     })

//     //adding group is fucky===========================

//     it('everything loads with Data Products', () => {
//         cy.get('a[href="?tab=integrations"]').click()
//         cy.contains('Add a new Data Product').should('be.visible');
//         cy.contains('No Data Products. You have not added any Data Products...').should('be.visible');
//     })

//     it('Add a new Data Product has been clicked', () => {
//         cy.get('a[href="?tab=integrations"]').click()
//         cy.contains('Add a new Data Product').click();
//         cy.contains('Add a new Data Product').should('be.visible');
//         cy.get('button[type="button"]')
//             .should('be.visible');
//         cy.contains("Select Provider").should("be.visible")
//     })

//     it('Select Provider has been clicked', () => {
//         cy.get('a[href="?tab=integrations"]').click()
//         cy.contains('Add a new Data Product').click();
//         cy.contains('Add a new Data Product').should('be.visible');
//         cy.contains("Select Provider").click();
//         cy.get('#dropdown')
//             .should('be.visible');
//     })

//     it('ZARC has been clicked from dropdown and results shown', () => {
//         cy.get('a[href="?tab=integrations"]').click()
//         cy.contains('Add a new Data Product').click();
//         cy.contains('Add a new Data Product').should('be.visible');
//         cy.contains("Select Provider").click();
//         cy.get('#dropdown')
//             .should('be.visible')
//             .click();
//         cy.contains('Your email').should('be.visible');
//         cy.get('input[placeholder="name@company.com"]').should('be.visible');
//         cy.contains('Password').should('be.visible');
//         cy.get('input[placeholder="••••••••"]').should('be.visible');
//         cy.contains('Login to ZARC').should('be.visible')
        
//     })


// })