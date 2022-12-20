import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTENTS_API_PATH, CONTENT_TYPES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Content Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contentsActiveFilter');
        sessionStorage.removeItem('contentsTitleFilter');
        sessionStorage.removeItem('contentsContentTypeFilter');
        sessionStorage.removeItem('contentsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTENTS_API_PATH + '*').as('getList');
        cy.visit(Constant.CONTENT_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Content', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${CONTENTS_API_PATH}/${id}`).as('deleteContent');

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteContent').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
