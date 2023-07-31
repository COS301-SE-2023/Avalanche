describe('Domain Length', () => {
    beforeEach(() => {
        cy.setCookie('jwt', Cypress.env('jwt'));
        cy.visit(Cypress.env('baseURL') + ':' + Cypress.env('basePort') + '/domainLength');
        cy.wait(5000);
    });

    it('renders Sidebar with links', () => {

        cy.get('#default-sidebar')
            .should('be.visible');

        cy.get('#default-sidebar a[href="/domainLength"]')
            .should('be.visible')
            .and('contain', 'Domain Length');

    });

    it('renders page header', () => {

        cy.get('h1')
            .should('be.visible');

    });

    it('check requests received and graphs load ', () => {

        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://gateway:4000/ryce/domainNameAnalysis/length').as('postCheck');

        // Wait for 5 POST requests to complete
        for (let i = 0; i < 2; i++) {
            cy.wait('@postCheck').then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
            });
        }

        // Check the heading of each graph
        // Check that the word 'Monthly' appears on the page
        cy.contains('Length of newly created domains from 2022-01-01 to 2022-12-31 across all registrars for all zones').should('be.visible');

        // Check that the word 'Yearly' appears on the page
        cy.contains('Length of newly created domains from 2022-05-08 to 2022-12-31 across all registrars for all zones').should('be.visible');


        // Check for the existence of canvas in each graph
        cy.get('.block.p-6 .h-96 canvas').should('have.length', 2);
    });

    it('checks requests responses', () => {
        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://127.0.0.1:4000/ryce/domainNameAnalysis/length*').as('postCheck');
    
        // Array of request processing promises
        const requestPromises = [];
        for (let i = 0; i < 2; i++) {

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
    
                if (requestData.dateFrom!= undefined) {
                    console.log("here");
                    console.log(requestData);
                    console.log(responseData.data.graphName);
                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Length of newly created domains from ');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'domainNameAnalysis/length');
    
                } else  {
                    console.log("here2");
                    console.log(requestData);
                    console.log(responseData.data.graphName);

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Length of newly created domains from ');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'domainNameAnalysis/length');
    
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
