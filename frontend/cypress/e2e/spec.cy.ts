describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('Home page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  })

  it('should return a successful response', () => {
    cy.request('http://localhost:3000/').its("status")
      .should('equal', 200);
  });

  it('ensures all elements exist', () => {
    cy.get('body').should('exist');
    cy.get('script').should('exist');
    cy.get('#__next').should('exist');
    cy.get('#__NEXT_DATA__').should('exist');
  });

  it('should have specific headers', () => {
    cy.request('http://localhost:3000/')
      .its('headers')
      .should('include', {
        'content-type': 'text/html; charset=utf-8',
      });
  });
})