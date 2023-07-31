describe('Registrar Transaction Dashboard', () => {
    beforeEach(() => {
        cy.setCookie('jwt', Cypress.env('jwt'));
        cy.visit(Cypress.env('baseURL') + ':' + Cypress.env('basePort') + '/registrarMarketComparison');
        cy.wait(5000);
    });

    it('renders Sidebar with links', () => {

        cy.get('#default-sidebar')
            .should('be.visible');

        cy.get('#default-sidebar a[href="/marketShare"]')
            .should('be.visible')
            .and('contain', 'Market Share');

    });

    it('renders page header', () => {

        cy.get('h1')
            .should('be.visible');

    });

    it('check requests received and graphs load ', () => {

        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://gateway:4000/ryce/marketShare').as('postCheck');

        // Wait for 5 POST requests to complete
        for (let i = 0; i < 4; i++) {
            cy.wait('@postCheck').then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
            });
        }

        // Check the heading of each graph
        cy.contains('Domain count marketshare for the top5 registrars in terms of domain count across all registrars for all zones').should('be.visible');

        cy.contains('Domain count marketshare for the top10 registrars in terms of domain count across all registrars for all zones').should('be.visible');

        cy.contains('Domain count marketshare for the top20 registrars in terms of domain count across all registrars for all zones').should('be.visible');

        cy.contains('Domain count marketshare for the bottom20 registrars in terms of domain count across all registrars for all zones').should('be.visible');

        // Check for the existence of canvas in each graph
        cy.get('.block.p-6 .h-96 canvas').should('have.length', 4);
    });

    it('checks requests responses', () => {
        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://gateway:4000/ryce/marketShare*').as('postCheck');
    
        // Array of request processing promises
        const requestPromises = [];
        for (let i = 0; i < 4; i++) {

            requestPromises.push(

                new Cypress.Promise((resolve) => {

                    cy.wait('@postCheck').then((interception) => {

                        expect(interception.response.statusCode).to.eq(201);

                        resolve({ 
                            request: interception.request, 
                            response: interception.response 
                        });
                    });

                })

            );
        }
    
        // When all requests are intercepted and processed
        cy.wrap(Promise.all(requestPromises)).then((interactions) => {

            interactions.forEach(({ request, response }) => {
                // Perform your checks using request and response...
                console.log("WEEEE");
                console.log(request);

                const responseData = response.body;
                const requestData = request.body;
                console.log(requestData);
    
                cy.wrap(responseData.status).should('eq', 'success');
    
                if (requestData.rank == 'top5') {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'top5');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'marketShare');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('have.length', 5);
                } else if(requestData.rank == 'top10')  {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'top10');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'marketShare');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('have.length', 10);
                } else if(requestData.rank == 'top20')  {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'top20');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'marketShare');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('have.length', 20);
                }else if(requestData.rank == 'bottom20')  {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'bottom20');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'marketShare');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).its('length').should('be.gte', 20);
                }
    
                // Check each dataset to see if it contains a label and data
                responseData.data.datasets.forEach(dataset => {
                    expect(dataset).to.have.property('label');

                    expect(dataset).to.have.property('data');

                });
            });
        });
    });
   
});
