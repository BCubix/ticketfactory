import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CATEGORIES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Create Category Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + CATEGORIES_API_PATH).as('createCategory');
        cy.visit(Constant.CATEGORIES_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Category', () => {
        cy.get('#name').type('New Category');
        cy.get('#parentCategoryValue-1').click();
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@createCategory').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Check Validation', () => {
        cy.get('#name').focus().blur();
        cy.get('#name-helper-text').should('exist');
        cy.get('#name').type('Test Validation');

        cy.get('#submitForm').click();
        cy.get('#parent-helper-text').should('exist');
    });
});
