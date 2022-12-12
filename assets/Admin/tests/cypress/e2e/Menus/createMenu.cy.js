import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, MENUS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Create Menu Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + MENUS_API_PATH).as('createMenu');
        cy.visit(Constant.MENUS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Menu', () => {
        cy.get('#name').type('New Menu');
        cy.get('#submitForm').click();

        cy.wait('@createMenu').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });
});
