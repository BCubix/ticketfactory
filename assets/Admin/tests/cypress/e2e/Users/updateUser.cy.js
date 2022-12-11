import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, SEASONS_API_PATH, USERS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update User Spec', () => {
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

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${USERS_API_PATH}/${id}`).as('updateUser');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update User', () => {
        cy.get('#email').clear().type('email2Edit@gmail.com');
        cy.get('#roles').click();
        cy.get('#userRolesValue-ROLE_USER').click();
        cy.get('#firstName').clear().type('FirstName Edit');
        cy.get('#lastName').clear().type('LastName Edit');
        cy.get('#password').clear().type('Password!02');
        cy.get('#confirmPassword').type('Password!02');
        cy.get('#submitForm').click();

        cy.wait('@updateUser').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
