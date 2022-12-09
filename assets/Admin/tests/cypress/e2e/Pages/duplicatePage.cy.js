import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, PAGES_API_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Duplicate Page Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('pagesActiveFilter');
        sessionStorage.removeItem('pagesTitleFilter');
        sessionStorage.removeItem('pagesSort');

        cy.intercept('POST', `${ADMIN_API_BASE_PATH}${PAGES_API_PATH}/1/duplicate`).as('duplicatePage');
        cy.visit(Constant.PAGES_BASE_PATH);
        cy.wait(500);
    });

    it('duplicate Page', () => {
        cy.get(`#actionButton-1`).click();
        cy.get(`#duplicateButton-1`).click();

        cy.wait('@duplicatePage').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
