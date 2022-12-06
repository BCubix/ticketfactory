import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    EVENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Duplicate Event Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('eventsActiveFilter');
        sessionStorage.removeItem('eventsNameFilter');
        sessionStorage.removeItem('eventsCategoryFilter');
        sessionStorage.removeItem('eventsRoomFilter');
        sessionStorage.removeItem('eventsSeasonFilter');
        sessionStorage.removeItem('eventsTagsFilter');
        sessionStorage.removeItem('eventsSort');

        cy.intercept('POST', `${ADMIN_API_BASE_PATH}${EVENTS_API_PATH}/1/duplicate`).as(
            'duplicateEvent'
        );
        cy.visit(Constant.EVENTS_BASE_PATH);
        cy.wait(500);
    });

    it('duplicate Event', () => {
        cy.get(`#actionButton-1`).click();
        cy.get(`#duplicateButton-1`).click();

        cy.wait('@duplicateEvent').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
