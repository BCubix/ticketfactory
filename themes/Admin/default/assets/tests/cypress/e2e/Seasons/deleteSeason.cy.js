import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Season Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('seasonsActiveFilter');
        sessionStorage.removeItem('seasonsNameFilter');
        sessionStorage.removeItem('seasonsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + SEASONS_API_PATH + '*').as('getList');
        cy.visit(Constant.SEASONS_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Season', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${SEASONS_API_PATH}/${id}`).as('deleteSeason');

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteSeason').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
