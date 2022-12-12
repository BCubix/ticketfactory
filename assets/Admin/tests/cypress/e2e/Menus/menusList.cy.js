import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, MENUS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Menus List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + MENUS_API_PATH + '*').as('getMenus');
        cy.visit(Constant.MENUS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getMenus').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body?.length).to.greaterThan(0);
        });
    });
});
