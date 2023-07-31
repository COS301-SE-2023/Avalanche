describe('Sign in Page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseURL') + ":" + Cypress.env('basePort'));
  });

  it('successfully loads', () => {
    cy.contains('Avalanche Analytics'); 
  });

  it('should have email input', () => {
    cy.get('input[name=email]')
      .should('have.attr', 'placeholder', 'name@company.com')
      .should('have.value', '');
  });

  it('should have password input', () => {
    cy.get('input[name=password]')
      .should('have.attr', 'placeholder', '••••••••')
      .should('have.value', '');
  });

  it('should navigate to "Forgot password" page on clicking "Forgot password"', () => {
    cy.get('a[href="/forgot"]').click();
    cy.url().should('include', '/forgot');
  });

  it('should navigate to "Register" page on clicking "Sign up"', () => {
    cy.contains("Sign up").click();
    cy.url().should('include', '/register');
  });

  // Assuming you have a valid user in your application with the following credentials:
  // Email: 'valid.user@example.com'
  // Password: 'validpassword'
  it('should login with valid credentials', () => {
    cy.get('input[name=email]').type('ingeodendaal5@gmail.com');
    cy.get('input[name=password]').type('password');
    cy.get('button[type=submit]').click();

    // Assuming that successful login redirects to '/dashboard'
    cy.url().should('include', '/dashboard');
  });
});

describe('Register Test', () => {

    beforeEach(() => {
        // Visiting the register page before each test
        cy.visit('http://localhost:3000/register');
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

    it('Should display verification if all details are correct', () => {
      cy.get('#name').type('Test');
      cy.get('#surname').type('User');
      cy.get('#email').type('test@test.com');
      cy.get('#confirm-email').type('test@test.com');
      cy.get('#password').type('Password123');
      cy.get('#confirm-password').type('Password123');
      cy.get('#terms').check();

      cy.get('button[type="submit"]').click();

      cy.contains('Verification'); 

  })
  });
  
