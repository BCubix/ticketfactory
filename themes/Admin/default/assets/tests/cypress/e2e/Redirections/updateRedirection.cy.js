import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, LOCAL_URL, REDIRECTIONS_API_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Redirection Spec', () => {
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

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${REDIRECTIONS_API_PATH}/${id}`).as('updateRedirection');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Redirection', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').clear().type(`${LOCAL_URL}/admin/evenements`);
        cy.get('#redirectTo').clear().type(`${LOCAL_URL}/admin/`);

        cy.get('#submitForm').click();

        cy.wait('@updateRedirection').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
