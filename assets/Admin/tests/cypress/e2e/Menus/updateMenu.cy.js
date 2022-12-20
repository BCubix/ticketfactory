import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, MENUS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Menu Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + MENUS_API_PATH + '*').as('getMenus');
        cy.visit(Constant.MENUS_BASE_PATH);

        cy.wait('@getMenus').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body?.length).to.greaterThan(0);

            let id = response.body?.at(-1).id;
            cy.intercept('POST', ADMIN_API_BASE_PATH + MENUS_API_PATH + `/${id}`).as('updateMenu');
        });
    });

    it('Update Menu', () => {
        cy.get('#categories-menus-elements-header').click();
        cy.get('#categoriesMenuEntryValue-1').click();
        cy.get('#categoriesMenuEntrySubmit').click();

        cy.get('#events-menus-elements-header').click();
        cy.get('#eventsMenuEntryValue-1').click();
        cy.get('#eventsMenuEntrySubmit').click();

        cy.get('#pages-menus-elements-header').click();
        cy.get('#pagesMenuEntryValue-1').click();
        cy.get('#pagesMenuEntrySubmit').click();

        cy.get('#rooms-menus-elements-header').click();
        cy.get('#roomsMenuEntryValue-1').click();
        cy.get('#roomsMenuEntrySubmit').click();

        cy.get('#name').clear().type('Menu Edit');

        cy.get('#submitForm').click();
        cy.wait('@updateMenu').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
