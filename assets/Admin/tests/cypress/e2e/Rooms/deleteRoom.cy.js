import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, ROOMS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Room Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('roomsActiveFilter');
        sessionStorage.removeItem('roomsNameFilter');
        sessionStorage.removeItem('roomsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + ROOMS_API_PATH + '*').as('getList');
        cy.visit(Constant.ROOMS_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Room', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${ROOMS_API_PATH}/${id}`).as('deleteRoom');

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteRoom').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
