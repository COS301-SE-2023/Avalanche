describe('Register Test', () => {

    beforeEach(() => {
        // Visiting the register page before each test
        cy.visit(Cypress.env('baseURL') + ":" + Cypress.env('basePort') + '/register');
    });
  
    it('Should display validation error if emails do not match', () => {
        cy.get('#name').type('Test');
        cy.get('#surname').type('User');
        cy.get('#email').type('test@test.com');
        cy.get('#confirm-email').type('test1@test.com');
        cy.get('#password').type('Password123');
        cy.get('#confirm-password').type('Password123');
        cy.get('#terms').check();
  
        cy.get('button[type="submit"]').click();
  
        cy.get('#toast-warning').should('exist');

    });
  
    it('Should display validation error if passwords do not match', () => {
        cy.get('#name').type('Test');
        cy.get('#surname').type('User');
        cy.get('#email').type('test@test.com');
        cy.get('#confirm-email').type('test@test.com');
        cy.get('#password').type('Password123');
        cy.get('#confirm-password').type('Password124');
        cy.get('#terms').check();
  
        cy.get('button[type="submit"]').click();
  
        cy.get('#toast-warning').should('exist');

    });
  
    it('Should display validation error if name is not provided', () => {
        cy.get('#surname').type('User');
        cy.get('#email').type('test@test.com');
        cy.get('#confirm-email').type('test@test.com');
        cy.get('#password').type('Password123');
        cy.get('#confirm-password').type('Password123');
        cy.get('#terms').check();
  
        cy.get('button[type="submit"]').click();
  
        cy.get('#toast-warning').should('exist');

    });
  
    it('Should display validation error if surname is not provided', () => {
        cy.get('#name').type('Test');
        cy.get('#email').type('test@test.com');
        cy.get('#confirm-email').type('test@test.com');
        cy.get('#password').type('Password123');
        cy.get('#confirm-password').type('Password123');
        cy.get('#terms').check();
  
        cy.get('button[type="submit"]').click();
  
        cy.get('#toast-warning').should('exist');

    });
  });
  