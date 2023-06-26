describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('Home page test', () => {
  it('should return a successful response', () => {
    cy.request('http://localhost:3000/')
      .its('status')
      .should('equal', 200);
  });
})