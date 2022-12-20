import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, MENUS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Menu Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + MENUS_API_PATH + '*').as('getMenus');
        cy.visit(Constant.MENUS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getMenus').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body?.length).to.greaterThan(0);

            let id = response.body?.at(-1).id;
            cy.intercept('DELETE', ADMIN_API_BASE_PATH + MENUS_API_PATH + `/${id}`).as('deleteMenu');
        });
    });

    it('Delete Room', () => {
        cy.get('#deleteMenuButton').click();
        cy.get('#validateDeleteDialog').click();

        cy.wait('@deleteMenu').then(({ response }) => {
            expect(response.statusCode).to.eq(204);
        });
    });
});
