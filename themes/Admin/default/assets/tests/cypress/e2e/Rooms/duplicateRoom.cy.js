import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, ROOMS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Duplicate Room Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('roomsActiveFilter');
        sessionStorage.removeItem('roomsNameFilter');
        sessionStorage.removeItem('roomsSort');

        cy.intercept('POST', `${ADMIN_API_BASE_PATH}${ROOMS_API_PATH}/1/duplicate`).as('duplicateRoom');
        cy.visit(Constant.ROOMS_BASE_PATH);
        cy.wait(500);
    });

    it('duplicate Room', () => {
        cy.get(`#actionButton-1`).click();
        cy.get(`#duplicateButton-1`).click();

        cy.wait('@duplicateRoom').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
