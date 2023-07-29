describe('DomainWatch', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('12345');
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.url().should('eq', 'http://localhost:3000/dashboard');
        cy.get('#watch').click();

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