import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTACT_REQUESTS_API_PATH, CONTENT_TYPES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Content Type Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contentTypesActiveFilter');
        sessionStorage.removeItem('contentTypesNameFilter');
        sessionStorage.removeItem('contentTypesSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTENT_TYPES_API_PATH + '*').as('getList');
        cy.visit(Constant.CONTENT_TYPES_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${CONTENT_TYPES_API_PATH}/${id}`).as('updateContentType');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Content Type', () => {
        cy.get('#name').clear().type('New Content type edit');

        cy.get('#fields-0-title').clear().type('New field Edit');
        cy.get('#fields-0-name').clear().type('newField Edit');
        cy.get('#fields-0-helper').clear().type('New instruction Edit');

        cy.get('#submitForm').click();

        cy.wait('@updateContentType').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
