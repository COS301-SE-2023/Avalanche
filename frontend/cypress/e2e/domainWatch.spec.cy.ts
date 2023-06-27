describe('DomainWatch', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type('ingeodendaal5@gmail.com');
        cy.get('input[name=password]').type('password');
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('#default-sidebar a[href="/watch"]').click();
    });

    it('renders page header', () => {
        cy.get('h1') // Assuming the PageHeader component renders a <header> element.
            .should('be.visible');

        cy.contains('Watch your Domains'); 

    });

    it('should have domain input', () => {
        cy.get('input[name=domain]')
          .should('have.attr', 'placeholder', 'standardbank')
          .should('have.value', '');
      });

      it("should display a missing domain error", () => {
        cy.contains('Missing Domain.');
      });


});