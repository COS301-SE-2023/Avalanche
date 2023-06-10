import React from 'react'
import Custom404 from '../pages/404'

describe('<Custom404 />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Custom404 />)
  })
})