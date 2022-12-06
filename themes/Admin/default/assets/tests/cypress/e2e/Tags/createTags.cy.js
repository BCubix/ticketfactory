import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    TAGS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Tags Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + TAGS_API_PATH).as('createTag');
        cy.visit(Constant.TAGS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Tag', () => {
        cy.get('#name').type('New Tag');
        cy.get('#descriptionControl .ck-content').type('New Description Tag');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@createTag').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Tag (no name)', () => {
        cy.get('#name').focus().blur();
        cy.get('#descriptionControl .ck-content').type('New Description Tag');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#name-helper-text').should('exist');
    });

    it('Create Tag (no description)', () => {
        cy.get('#name').type('New Tag');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@createTag').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });
});
