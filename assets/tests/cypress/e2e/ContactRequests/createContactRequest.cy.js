import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    CONTACT_REQUESTS_API_PATH,
    USERS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Contact Request Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + CONTACT_REQUESTS_API_PATH).as(
            'createContactRequest'
        );
        cy.visit(Constant.USER_BASE_PATH + Constant.CONTACT_REQUEST_BASE_PATH);
        cy.wait(500);
    });

    it('Create Contact Request', () => {
        cy.get('#firstName').type('New FirstName');
        cy.get('#lastName').type('New LastName');
        cy.get('#email').type('email2@gmail.com');
        cy.get('#phone').type('0601020304');
        cy.get('#subject').type('New Subject');
        cy.get('[type="submit"]').click();

        cy.wait('@createContactRequest').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });
    // Stopped here
    it('Create Contact Request (bad Email)', () => {
        cy.get('#email').type('email2');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create Contact Request (no Email)', () => {
        cy.get('#email').focus().blur();
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create Contact Request (bad password)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('bad password');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#password-helper-text').should('exist');
    });

    it('Create Contact Request (no password)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#password').focus().blur();
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#password-helper-text').should('exist');
    });

    it('Create Contact Request (no firstName)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').focus().blur();
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#firstName-helper-text').should('exist');
    });

    it('Create Contact Request (no lastName)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').focus().blur();
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#lastName-helper-text').should('exist');
    });

    it('Create Contact Request (no confirmPassword)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').focus().blur();
        cy.get('[type="submit"]').click();

        cy.get('#confirmPassword-helper-text').should('exist');
    });

    it('Create Contact Request (bad confirmPassword)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('badConfirmPassword');
        cy.get('[type="submit"]').click();

        cy.get('#confirmPassword-helper-text').should('exist');
    });
});
