import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, ROOMS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Tag Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('roomsActiveFilter');
        sessionStorage.removeItem('roomsNameFilter');
        sessionStorage.removeItem('roomsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + ROOMS_API_PATH + '*').as('getList');
        cy.visit(Constant.ROOMS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${ROOMS_API_PATH}/${id}`).as('updateRoom');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Room', () => {
        cy.get('#name').clear().type('New Room Edit');
        cy.get('#seatsNb').clear().type('60');
        cy.get('#area').clear().type('120');

        cy.get('#submitForm').click();

        cy.wait('@updateRoom').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
