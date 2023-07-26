const baseURL = 'http://localhost:3000/';

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

describe('Auth', () => {
  describe('login', ()=>{
    it('Endpoint is reachable', async() => {
      cy.request(baseURL + '/auth/login').its('status').should('equal', 200)
    })
  })
})