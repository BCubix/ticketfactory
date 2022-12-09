import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Duplicate Season Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('seasonsActiveFilter');
        sessionStorage.removeItem('seasonsNameFilter');
        sessionStorage.removeItem('seasonsSort');

        cy.intercept('POST', `${ADMIN_API_BASE_PATH}${SEASONS_API_PATH}/1/duplicate`).as('duplicateSeason');
        cy.visit(Constant.SEASONS_BASE_PATH);
        cy.wait(500);
    });

    it('duplicate Season', () => {
        cy.get(`#actionButton-1`).click();
        cy.get(`#duplicateButton-1`).click();

        cy.wait('@duplicateSeason').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
