import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, USERS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete User Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('usersActiveFilter');
        sessionStorage.removeItem('usersEmailFilter');
        sessionStorage.removeItem('usersFirstNameFilter');
        sessionStorage.removeItem('usersLastNameFilter');
        sessionStorage.removeItem('usersRoleFilter');
        sessionStorage.removeItem('usersSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + USERS_API_PATH + '*').as('getList');
        cy.visit(Constant.USER_BASE_PATH);
        cy.wait(500);
    });

    it('Delete User', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${USERS_API_PATH}/${id}`).as('deleteUser');

            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteUser').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
