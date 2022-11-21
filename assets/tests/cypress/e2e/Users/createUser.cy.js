import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    USERS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create User Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + USERS_API_PATH).as('createUser');
        cy.visit(Constant.USER_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create User', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.wait('@createUser').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create User (bad Email)', () => {
        cy.get('#email').type('email2');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create User (no Email)', () => {
        cy.get('#email').focus().blur();
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Create User (bad password)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('bad password');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#password-helper-text').should('exist');
    });

    it('Create User (no password)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#password').focus().blur();
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#password-helper-text').should('exist');
    });

    it('Create User (no firstName)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').focus().blur();
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#firstName-helper-text').should('exist');
    });

    it('Create User (no lastName)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').focus().blur();
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('[type="submit"]').click();

        cy.get('#lastName-helper-text').should('exist');
    });

    it('Create User (no confirmPassword)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').focus().blur();
        cy.get('[type="submit"]').click();

        cy.get('#confirmPassword-helper-text').should('exist');
    });

    it('Create User (bad confirmPassword)', () => {
        cy.get('#email').type('email2@gmail.com');
        cy.get('#firstName').type('FirstName 2');
        cy.get('#lastName').type('LastName 2');
        cy.get('#password').type('Password!02');
        cy.get('#confirmPassword').type('badConfirmPassword');
        cy.get('[type="submit"]').click();

        cy.get('#confirmPassword-helper-text').should('exist');
    });
});
