describe('DomainWatch', () => {

    before(()=>{
        
    });
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort')+"/");
        cy.url().should('eq', Cypress.env('baseURL')+"/");
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click();  
        cy.wait(4000);
        cy.wait(1000);
        cy.get("a[href='/watch']",{timeout:10000}).click();
        cy.wait(3000);
        cy.url().should('eq', Cypress.env('baseURL')  + Cypress.env('basePort') + '/watch')
    });
    

    it('renders page header', () => {
        cy.get('h1') // Assuming the PageHeader component renders a <header> element.
            .should('be.visible');

        cy.contains('Watch your Domains').should('be.visible'); 

    });

    it('should have domain input', () => {
        cy.get('input[name=domain]')
          .should('have.attr', 'placeholder', 'standardbank')
          .should('have.value', '');
      });

      it("should display a missing domain error", () => {
        const role="alert";
        cy.get(`[role=${role}]`);
        cy.contains('Missing domain.');
      });
});