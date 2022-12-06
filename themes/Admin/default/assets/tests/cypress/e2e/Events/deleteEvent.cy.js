import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    EVENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Delete Event Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('eventsActiveFilter');
        sessionStorage.removeItem('eventsNameFilter');
        sessionStorage.removeItem('eventsCategoryFilter');
        sessionStorage.removeItem('eventsRoomFilter');
        sessionStorage.removeItem('eventsSeasonFilter');
        sessionStorage.removeItem('eventsTagsFilter');
        sessionStorage.removeItem('eventsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + EVENTS_API_PATH + '*').as('getEvents');
        cy.visit(Constant.EVENTS_BASE_PATH);
        cy.wait(500);
    });

    it('delete Event', () => {
        let id;

        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body.results.map((el) => el.id);
            id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${EVENTS_API_PATH}/${id}`).as(
                'deleteEvent'
            );

            cy.get(`#actionButton-${id}`).click();
            cy.get(`#deleteButton-${id}`).click();

            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteEvent').then(({ response }) => {
                expect(response.statusCode).to.eq(200);
            });
        });
    });
});
