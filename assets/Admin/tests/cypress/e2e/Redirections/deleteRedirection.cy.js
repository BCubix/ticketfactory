import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, PAGES_API_PATH, REDIRECTIONS_API_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Redirection Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('redirectionsActiveFilter');
        sessionStorage.removeItem('redirectionsRedirectTypeFilter');
        sessionStorage.removeItem('redirectionsRedirectFromFilter');
        sessionStorage.removeItem('redirectionsRedirectToFilter');
        sessionStorage.removeItem('redirectionsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + REDIRECTIONS_API_PATH + '*').as('getList');
        cy.visit(Constant.REDIRECTIONS_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Redirection', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${REDIRECTIONS_API_PATH}/${id}`).as('deleteRedirection');

            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteRedirection').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
