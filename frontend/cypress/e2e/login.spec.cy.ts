describe('Sign in Page', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('baseURL') + ":" + Cypress.env('basePort'));
      cy.url().should('eq', Cypress.env('baseURL'));
    });
  
    it('successfully loads', () => {
      cy.contains('Avalanche Analytics'); 
    });
  
    it('should have email input', () => {
      cy.get('input[name=email]')
        .should('have.attr', 'placeholder', 'michael@dundermifflin.com')
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
  });

describe.only('login', () =>{
    beforeEach(() =>{
      cy.visit(Cypress.env('baseURL') + ":" + Cypress.env('basePort'));
      cy.url().should('eq', Cypress.env('baseURL') + ":" + Cypress.env('basePort')+'/');
    })

    /*it('Signin with nothing completed', () => {
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('#toast-warning').should('exist');
    })*/

    it('Incorrect email and password', () =>{
        //given
        cy.get('input[name=email]').type('fake@fakier.com');
        cy.get('input[name=password]').type('fakePassword');
        cy.intercept("POST", "user-management/login").as("response")

        //when
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.wait(10000);

        //then
        cy.wait("@response").then((interception) => {
            const result = interception.response
            expect(result.statusCode).to.equal(400)
            expect(result.body.message).to.equal("This user does not exist, please enter the correct email/please register.")
        })
    })

    it('Correct email but incorrect password', () => {
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('fakePassword');
        cy.intercept("POST", "user-management/login").as("response")

        cy.get('button[type=submit]').click();
        cy.wait(10000);

        cy.wait("@response").then((interception) => {
            const result = interception.response
            expect(result.statusCode).to.equal(400)
            expect(result.body.message).to.equal("This user does not exist, please enter the correct email/please register.")
        })
    })

    it('Correct email and correct password', () => {
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.intercept("POST", "user-management/login").as("response")

        cy.get('button[type=submit]').click();
        cy.wait(10000);
        
        cy.wait("@response").then((interception) => {
            const result = interception.response
            expect(result.statusCode).to.equal(201)
        })

        cy.url().should("include", "/dashboard")
    })


})