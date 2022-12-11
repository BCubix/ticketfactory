import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTACT_REQUESTS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Contact Request Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contactRequestsActiveFilter');
        sessionStorage.removeItem('contactRequestsFirstNameFilter');
        sessionStorage.removeItem('contactRequestsLastNameFilter');
        sessionStorage.removeItem('contactRequestsEmailFilter');
        sessionStorage.removeItem('contactRequestsPhoneFilter');
        sessionStorage.removeItem('contactRequestsSubjectFilter');
        sessionStorage.removeItem('contactRequestsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTACT_REQUESTS_API_PATH + '*').as('getList');
        cy.visit(Constant.CONTACT_REQUEST_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Contact Request', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${CONTACT_REQUESTS_API_PATH}/${id}`).as('deleteContactRequest');

            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteContactRequest').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
