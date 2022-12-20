import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTACT_REQUESTS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Contact Request Spec', () => {
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

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${CONTACT_REQUESTS_API_PATH}/${id}`).as('updateContactRequest');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Contact Request', () => {
        cy.get('#firstName').clear().type('New FirstName Edit');
        cy.get('#lastName').clear().type('New LastName Edit');
        cy.get('#email').clear().type('email2Edit@gmail.com');
        cy.get('#phone').clear().type('0601020304');
        cy.get('#subject').clear().type('New Subject Edit');
        cy.get('#message').clear().type('New Message Edit');
        cy.get('#submitForm').click();

        cy.wait('@updateContactRequest').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
