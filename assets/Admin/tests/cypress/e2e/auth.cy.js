import { USER_EMAIL, USER_PASSWORD } from '../../cypress.constant';

describe('Auth Spec', () => {
    it('Login', () => {
        cy.intercept('POST', '/admin/api/login_check').as('loginCheck');
        cy.visit('/admin/connexion');

        cy.get('#email').type(USER_EMAIL);
        cy.get('#password').type(USER_PASSWORD);
        cy.get('[type="submit"]').click();

        cy.wait('@loginCheck').its('response.statusCode').should('be.oneOf', [200]);
    });

    it('Login Fail (Bad Password)', () => {
        cy.intercept('POST', '/admin/api/login_check').as('loginCheck');
        cy.visit('/admin/connexion');

        cy.get('#email').type(USER_EMAIL);
        cy.get('#password').type('bad password');
        cy.get('[type="submit"]').click();

        cy.wait('@loginCheck').its('response.statusCode').should('be.oneOf', [401]);
    });

    it('Login Fail (Bad Email)', () => {
        cy.intercept('POST', '/admin/api/login_check').as('loginCheck');
        cy.visit('/admin/connexion');

        cy.get('#email').type('Bad-Email@gmail.com');
        cy.get('#password').type(USER_PASSWORD);
        cy.get('[type="submit"]').click();

        cy.wait('@loginCheck').its('response.statusCode').should('be.oneOf', [401]);
    });

    it('Login Fail (No Password)', () => {
        cy.visit('/admin/connexion');

        cy.get('#email').type(USER_EMAIL);
        cy.get('#password').focus().blur();
        cy.get('[type="submit"]').click();

        cy.get('#password-helper-text').should('exist');
    });

    it('Login Fail (No Email)', () => {
        cy.visit('/admin/connexion');

        cy.get('#email').focus().blur();
        cy.get('#password').type(USER_PASSWORD);
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });

    it('Login Fail (Invalid Email)', () => {
        cy.visit('/admin/connexion');

        cy.get('#email').type('Invalid Email');
        cy.get('#password').type(USER_PASSWORD);
        cy.get('[type="submit"]').click();

        cy.get('#email-helper-text').should('exist');
    });
});
