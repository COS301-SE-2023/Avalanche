describe('Registrar Transaction Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type(Cypress.env('username'));
        cy.get('input[name=password]').type(Cypress.env('password'));
        cy.get('button[type=submit]').click();
        cy.url().should('eq', 'http://localhost:3000/dashboard');
        cy.get('#default-sidebar a[href="/ageAnalysis"]').click();
        cy.wait(5000);
        cy.url().should('contain', 'http://localhost:3000/ageAnalysis');

    });

    it('renders Sidebar with links', () => {

        cy.get('#default-sidebar')
            .should('be.visible');

        cy.get('#default-sidebar a[href="/ageAnalysis"]')
            .should('be.visible')
            .and('contain', 'Age Analysis');

    });

    it('renders page header', () => {

        cy.get('h1')
            .should('be.visible');

    });

    it('check requests received and graphs load ', () => {

        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://127.0.0.1:4000/ryce/age').as('postCheck');

        // Wait for 5 POST requests to complete
        for (let i = 0; i < 4; i++) {
            cy.wait('@postCheck').then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
            });
        }

        // Check the heading of each graph
        cy.contains('Age Analysis of domains for the top5 registrars in terms of domain count , showing the average age per registrar').should('be.visible');

        cy.contains('Age Analysis of domains for the top5 registrars in terms of domain count , showing the number of domains per age per registrar').should('be.visible');

        cy.contains('Age Analysis of domains for the top20 registrars in terms of domain count , showing the average age per registrar').should('be.visible');

        cy.contains('Age Analysis of domains for the top10 registrars in terms of domain count , showing the average age per registrar').should('be.visible');

        // Check for the existence of canvas in each graph
        cy.get('.block.p-6 .h-96 canvas').should('have.length', 4);
    });

    it('checks requests responses', () => {
        // Check that all requests for graphs have status code 201
        cy.intercept('POST', 'http://127.0.0.1:4000/ryce/age*').as('postCheck');
    
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
    
                if (requestData.average == 'true') {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'average age');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'age');
    
                } else {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'number of domains');

                    cy.wrap(responseData.data.warehouse).should('eq', 'ryce');

                    cy.wrap(responseData.data.graphType).should('eq', 'age');

                } 
                if(requestData.overall == 'false')  {

                    // Check graphName, warehouse, and graphType
                    cy.wrap(responseData.data.graphName).should('include', 'per registrar');
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
