import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, PAGES_API_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Page Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('pagesActiveFilter');
        sessionStorage.removeItem('pagesTitleFilter');
        sessionStorage.removeItem('pagesSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + PAGES_API_PATH + '*').as('getList');
        cy.visit(Constant.PAGES_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Page', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${PAGES_API_PATH}/${id}`).as('deletePage');

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deletePage').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
