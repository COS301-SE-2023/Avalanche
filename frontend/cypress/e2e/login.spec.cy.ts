describe('login', () =>{
    beforeEach(() =>{
        cy.visit('http://localhost:3000');
    })

    /*it('Signin with nothing completed', () => {
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        cy.get('#toast-warning').should('exist');
    })*/

    it('Incorrect email and password', () =>{
        //given
        cy.get('input[name=email]').type('fake@fakier.com');
        cy.get('input[name=password]').type('fakePassword');
        cy.intercept("POST", "user-management/login").as("response")

        //when
        cy.get('button[type=submit]').click(); // Please replace with the actual route of your Dashboard page.
        
        //then
        cy.wait("@response").then((interception) => {
            const result = interception.response
            expect(result.statusCode).to.equal(400)
            expect(result.body.message).to.equal("This user does not exist, please enter the correct email/please register.")
        })
    })

    it('Correct email but incorrect password', () => {
        cy.get('input[name=email]').type('kihale5691@sportrid.com');
        cy.get('input[name=password]').type('fakePassword');
        cy.intercept("POST", "user-management/login").as("response")

        cy.get('button[type=submit]').click();

        cy.wait("@response").then((interception) => {
            const result = interception.response
            expect(result.statusCode).to.equal(400)
            expect(result.body.message).to.equal("Incorrect password")
        })
    })
})