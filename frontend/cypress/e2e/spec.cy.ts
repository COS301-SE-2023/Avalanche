describe('Sign in Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000') ;
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
