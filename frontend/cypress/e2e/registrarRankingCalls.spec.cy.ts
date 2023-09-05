describe('Registrar Transaction Dashboard', () => {
    beforeEach(() => {

        //cy.setCookie('jwt', Cypress.env('jwt'));
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort'));
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click();
        cy.wait(5000);
        cy.visit(Cypress.env('baseURL') + Cypress.env('basePort') + '/registrarMarketComparison');
        cy.wait(2000);
        cy.url().should('eq', Cypress.env('baseURL') + Cypress.env('basePort') + '/registrarMarketComparison');
    });

    it('renders Sidebar with links', () => {

        cy.get('#default-sidebar')
            .should('be.visible');

        cy.get('#default-sidebar a[href="/registrarMarketComparison"]')
            .should('be.visible')
            .and('contain', 'Registrar Market Comparison');

    });

    it('renders page header', () => {

        cy.get('h1')
            .should('be.visible');

    });

    it('check requests received and graphs load ', () => {

        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://gateway:4000/ryce/transactions-ranking*').as('postCheck');

        // Wait for 5 POST requests to complete
        for (let i = 0; i < 5; i++) {
            cy.wait('@postCheck').then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
            });
        }

        // Check the heading of each graph
        // Check that the word 'Monthly' appears on the page
        cy.contains('Monthly create').should('be.visible', 2);
        cy.contains('Monthly renew').should('be.visible', 2);
        cy.contains('Monthly transfer').should('be.visible');

        // Check for the existence of canvas in each graph
        cy.get('.block.p-6 .h-96 canvas').should('have.length', 5);
    });

    it('checks requests responses', () => {
        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://gateway:4000/ryce/transactions-ranking*').as('postCheck');
    
        // Array of request processing promises
        const requestPromises = [];
        for (let i = 0; i < 5; i++) {

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
                const transType = requestData.transactions[0];
    
                if (request.granularity === 'month') {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Monthly ' + transType +' per registrar');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'transactions');
    
                    // Check the existence and length of labels and datasets arrays
                    expect(responseData.data).to.have.property('labels');
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
