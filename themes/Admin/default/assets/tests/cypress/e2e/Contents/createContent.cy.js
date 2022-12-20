import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTENTS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Create Content Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + CONTENTS_API_PATH + '/1/create').as('createContent');
        cy.visit(Constant.CONTENT_BASE_PATH);

        cy.get('#createContentButton').click();
        cy.get('#selectContentType').click();
        cy.get('#selectContentTypeValue-1').click();
        cy.get('#validateDialog').click();

        cy.wait(500);
    });

    it('Create Content', () => {
        cy.get('#title').type('New Content Title');

        cy.get('#fields-title').type('Field Title');
        cy.get('#fields-subtitle').type('Field Subtitle');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.wait('@createContent').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Test Validation', () => {
        cy.get('#title').focus().blur();
        cy.get('#title-helper-text').should('exist');
        cy.get('#title').type('New Content');

        cy.get('#fields-title').focus().blur();
        cy.get('#fields-title-helper-text').should('exist');
        cy.get('#fields-title').type('test');
        cy.get('#fields-title-helper-text').should('exist');
        cy.get('#fields-title').type('test test test test test test');
        cy.get('#fields-title-helper-text').should('exist');
    });
});
