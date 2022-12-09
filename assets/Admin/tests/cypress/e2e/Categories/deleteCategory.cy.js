import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CATEGORIES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Category Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + CATEGORIES_API_PATH + '*').as('getCategories');
        cy.visit(Constant.CATEGORIES_BASE_PATH);
        cy.wait(500);
    });

    it('delete Category', () => {
        let id;

        cy.wait('@getCategories').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body.children.map((el) => el.id);
            id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${CATEGORIES_API_PATH}/${id}*`).as('deleteCategory');

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();

            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteCategory').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
