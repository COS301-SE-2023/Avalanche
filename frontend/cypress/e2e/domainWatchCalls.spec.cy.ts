describe('DomainWatch', () => {
    beforeEach(() => {
        cy.setCookie('jwt', Cypress.env('jwt'));
        cy.visit(Cypress.env('baseURL')  + Cypress.env('basePort') + '/watch');
        cy.wait(10000);
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