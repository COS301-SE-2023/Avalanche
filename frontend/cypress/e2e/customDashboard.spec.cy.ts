// describe('Custom Dashboard', () => {
//     before(() => {
//         cy.visit(Cypress.env('baseURL')+':'+Cypress.env('basePort'));
//         cy.get('input[name=email]').type(Cypress.env('username'));
//         cy.get('input[name=password]').type(Cypress.env('password'));
//         cy.get('button[type=submit]').click(); 
//     });

//     it('Should create a custom dashboard', () => {
//         const dashboardName = "My Custom Dashboard";

//         cy.get('button[type=submit]').contains('Create a Dashboard').click();
//         cy.get('input[name=name]').type(dashboardName);
//         cy.get('button[type=submit]').contains('Create Dashboard').click();
        
//         cy.url().should('include', Cypress.env('baseURL')+':'+Cypress.env('basePort') + '/custom/');
//         cy.url().should('include', `?name=${encodeURIComponent(dashboardName)}`);
//     });
// });
