const baseURL = 'http://localhost:3000/';
const server = 'http://localhost:4000/'

require('cypress-dotenv')();

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
    it('Endpoint is reachable', async() => {
      cy.request({
        method: 'GET',
        url: server + 'user-management/login',
        failOnStatusCode: false
      }).its('status').should('equal', 400)
    })

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
  })
})