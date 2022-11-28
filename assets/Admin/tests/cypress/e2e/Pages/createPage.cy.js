import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    PAGES_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Page Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + PAGES_API_PATH).as('createPage');
        cy.visit(Constant.PAGES_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Page', () => {
        cy.get('#title').type('New Page');
        cy.get('#addContentButton').click();
        cy.get('#pageBlocks-0-contentControl .ck-content').type('New content');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@createPage').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Page (no title)', () => {
        cy.get('#title').focus().blur();
        cy.get('#addContentButton').click();
        cy.get('#pageBlocks-0-contentControl .ck-content').type('New content');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#title-helper-text').should('exist');
    });

    it('Create Page (no content into first block)', () => {
        cy.get('#title').type('New Page');
        cy.get('#addContentButton').click();
        cy.get('#pageBlocks-0-contentControl .ck-content').focus().blur();
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#pageBlocks-0-content-helper-text').should('exist');
    });
});
