describe('Default Dashboard', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('baseURL') + ":" + Cypress.env('basePort'));
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
    });

    it('renders Sidebar with links', () => {
        it('The navigation should be visible', () => {
            cy.get('#default-sidebar')
                .should('be.visible');
        });

        it('Home link is visible', () => {
            cy.get('#default-sidebar a[href="/dashboard"]')
                .should('be.visible')
                .and('contain', 'Home');
        });
    });

    it('renders page header', () => {

        cy.get('h1')
            .should('be.visible');

    });

    it('check requests received and graphs load ', () => {

        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://127.0.0.1:4000/ryce/transactions*').as('postCheck');

        // Wait for 5 POST requests to complete
        for (let i = 0; i < 5; i++) {
            cy.wait('@postCheck').then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
            });
        }

        // Check the heading of each graph
        // Check that the word 'Monthly' appears on the page
        cy.contains('Monthly').should('be.visible', 2);

        // Check that the word 'Yearly' appears on the page
        cy.contains('Yearly').should('be.visible');

        // Check that the word 'Daily' appears on the page
        cy.contains('Daily').should('be.visible');

        // Check that the word 'Weekly' appears on the page
        cy.contains('Weekly').should('be.visible');

        // Check for the existence of canvas in each graph
        cy.get('.block.p-6 .h-96 canvas').should('have.length', 5);
    });

    it('checks requests responses', () => {
        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://127.0.0.1:4000/ryce/transactions*').as('postCheck');
    
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
                console.log(response);
                console.log(response.body);

                const responseData = response.body;
    
                cy.wrap(responseData.status).should('eq', 'success');
    
                if (request.granularity === 'year') {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Yearly Transactions from');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'transactions');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('have.length', 6);
                } else if (request.granularity === 'month') {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Monthly Transactions from');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'transactions');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('have.length', 12);
                } else if (request.granularity === 'week') {
                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Weekly Transactions from');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'transactions');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('be.within', 12, 16);
                } else if (request.granularity === 'day') {
                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'Daily Transactions from');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'transactions');
    
                    // Check the existence and length of labels and datasets arrays
                    cy.wrap(responseData.data.labels).should('be.within', 14, 16);
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
