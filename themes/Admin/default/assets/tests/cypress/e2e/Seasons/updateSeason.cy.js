import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Season Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('seasonsActiveFilter');
        sessionStorage.removeItem('seasonsNameFilter');
        sessionStorage.removeItem('seasonsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + SEASONS_API_PATH + '*').as('getList');
        cy.visit(Constant.SEASONS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${SEASONS_API_PATH}/${id}`).as('updateSeason');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Seasons', () => {
        cy.get('#name').clear().type('New Season Edit');
        cy.get('#beginYear').clear().type('2020');

        cy.get('#submitForm').click();

        cy.wait('@updateSeason').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
