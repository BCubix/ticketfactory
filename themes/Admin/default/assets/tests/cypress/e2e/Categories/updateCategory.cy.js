import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CATEGORIES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Category Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + CATEGORIES_API_PATH).as('getList');
        cy.visit(Constant.CATEGORIES_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.children?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${CATEGORIES_API_PATH}/${id}`).as('updateCategory');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Category', () => {
        cy.get('#name').clear().type('New Category Edit');

        cy.get('#submitForm').click();

        cy.wait('@updateCategory').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
