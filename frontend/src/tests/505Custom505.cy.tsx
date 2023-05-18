import React from 'react'
import Custom505 from './505'

describe('<Custom505 />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Custom505 />)
  })
})