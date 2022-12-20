import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTENT_TYPES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Content Type Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contentTypesActiveFilter');
        sessionStorage.removeItem('contentTypesNameFilter');
        sessionStorage.removeItem('contentTypesSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTENT_TYPES_API_PATH + '*').as('getList');
        cy.visit(Constant.CONTENT_TYPES_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Content Type', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${CONTENT_TYPES_API_PATH}/${id}`).as('deleteContentType');

            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteContentType').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
