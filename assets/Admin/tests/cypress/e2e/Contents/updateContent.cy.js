import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, CONTENTS_API_PATH, CONTENT_TYPES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Content Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contentsActiveFilter');
        sessionStorage.removeItem('contentsTitleFilter');
        sessionStorage.removeItem('contentsContentTypeFilter');
        sessionStorage.removeItem('contentsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTENTS_API_PATH + '*').as('getList');
        cy.visit(Constant.CONTENT_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${CONTENTS_API_PATH}/${id}/edit`).as('updateContent');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Content', () => {
        cy.get('#title').clear().type('New Content Edit');
        cy.get('#fields-title').clear().type('Title edit');
        cy.get('#fields-subtitle').clear().type('Field Subtitle edit');

        cy.get('#submitForm').click();

        cy.wait('@updateContent').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
