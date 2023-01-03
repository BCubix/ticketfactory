import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, PAGES_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Page Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('pagesActiveFilter');
        sessionStorage.removeItem('pagesTitleFilter');
        sessionStorage.removeItem('pagesSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + PAGES_API_PATH + '*').as('getList');
        cy.visit(Constant.PAGES_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${PAGES_API_PATH}/${id}`).as('updatePage');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Page', () => {
        cy.get('#title').clear().type('Test Page 1 MODIFY');
        cy.get('#pageBlocks-0-columns-0-contentControl .ck-content').clear().type('Test Block 1 MODIFY');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@updatePage').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
