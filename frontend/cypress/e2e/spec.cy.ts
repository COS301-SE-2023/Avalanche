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
    })


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

  const baseURL = 'http://localhost:3000/';
  const server = 'http://localhost:4000/'

  //require('cypress-dotenv')();

  describe('template spec', () => {
    it('passes', () => {
      cy.visit('https://example.cypress.io')
    })
  })

  describe('Home page test', () => {
    beforeEach(() => {
      cy.visit(baseURL);
    })

    it('should return a successful response', () => {
      cy.request(baseURL).its("status")
        .should('equal', 200);
    });

    it('ensures all elements exist', () => {
      cy.get('body').should('exist');
      cy.get('script').should('exist');
      cy.get('#__next').should('exist');
      cy.get('#__NEXT_DATA__').should('exist');
    });

    it('should have specific headers', () => {
      cy.request(baseURL)
        .its('headers')
        .should('include', {
          'content-type': 'text/html; charset=utf-8',
        });
    });
  })

  describe('User management', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
    describe('login', ()=>{
      /*it('Endpoint is reachable', async() => {
        cy.request({
          method: 'GET',
          url: server + 'user-management/login',
          failOnStatusCode: false
        }).its('status').should('equal', 400)
      })*/

      it('Email and password is empty', async() => {
        const requestBody = {
          email : "",
          password : ""
        };

        cy.request({
          method: 'POST',
          url : "127.0.0.1:4000/user-management/login",
          headers: {
            'Content-Type' : 'application/json'
          },
          body: requestBody,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(400);
        })
      })

      it('Email valid but password missing',async () => {
        //given
        const requestBody = {
          email : "u21804312@tuks.co.za",
          password : ""
        };
        cy.log(Cypress.env('email'))

        //when
        cy.request({
          method: 'POST',
          url: server + "user-management/login",
          headers: {
            'Content-Type' : 'application/json'
          },
          body: requestBody,
          failOnStatusCode: false
        }).then((response) => {
          
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal("Incorrect password")
        })
      })
    })
  }) 
})
  
