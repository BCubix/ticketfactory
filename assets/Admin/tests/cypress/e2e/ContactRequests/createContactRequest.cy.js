import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTACT_REQUESTS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Create Contact Request Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + CONTACT_REQUESTS_API_PATH).as('createContactRequest');
        cy.visit(Constant.CONTACT_REQUEST_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Contact Request', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.wait('@createContactRequest').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Contact Request (no FirstName)', () => {
        cy.get('#firstName').focus().blur();
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#firstName-helper-text').should('exist');
    });

    it('Create Contact Request (no LastName)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').focus().blur();
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#lastName-helper-text').should('exist');
    });

    it('Create Contact Request (bad Email)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create Contact Request (no Email)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').focus().blur();
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create Contact Request (bad phone)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('bad phone');
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#phone-helper-text').should('exist');
    });

    it('Create Contact Request (no phone)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').focus().blur();
        cy.get('#subject').type('New Subject');
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#phone-helper-text').should('exist');
    });

    it('Create Contact Request (no subject)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').focus().blur();
        cy.get('#message').type('New Message');
        cy.get('#submitForm').click();

        cy.get('#subject-helper-text').should('exist');
    });

    it('Create Contact Request (no message)', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('#message').focus().blur();
        cy.get('#submitForm').click();

        cy.get('#message-helper-text').should('exist');
    });
});
