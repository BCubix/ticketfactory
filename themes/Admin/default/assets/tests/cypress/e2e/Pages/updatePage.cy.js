import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    PAGES_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Update Page Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + PAGES_API_PATH + '/*').as('updatePage');
        cy.visit(Constant.PAGES_BASE_PATH + '/1' + Constant.EDIT_PATH);
        cy.wait(500);
    });

    it('Update Page', () => {
        cy.get('#title').clear().type('Test Page 1 MODIFY');
        cy.get('#pageBlocks-0-contentControl .ck-content').clear().type('Test Block 1 MODIFY');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@updatePage').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.title).to.eq('Test Page 1 MODIFY');
            expect(response.body.pageBlocks.at(0).content).contains('Test Block 1 MODIFY');
        });
    });
});
