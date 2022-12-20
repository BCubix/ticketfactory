import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, TAGS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Tags Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('tagsActiveFilter');
        sessionStorage.removeItem('tagsNameFilter');
        sessionStorage.removeItem('tagsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + TAGS_API_PATH + '*').as('getList');
        cy.visit(Constant.TAGS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${TAGS_API_PATH}/${id}`).as('updateTag');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Tag', () => {
        cy.get('#name').clear().type('New Tag Edit');

        cy.get('#submitForm').click();

        cy.wait('@updateTag').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
