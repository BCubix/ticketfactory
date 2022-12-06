import moment from 'moment';
import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    EVENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Update Event Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + EVENTS_API_PATH + '/1').as('updateEvent');
        cy.visit(Constant.EVENTS_BASE_PATH + '/1' + Constant.EDIT_PATH);
        cy.wait(500);
    });

    it('update Event', () => {
        /* ---------- Main part of Event Form ----------*/
        cy.get('#name').clear().type('New Event Title Edit');
        /* ---------- ---------- */

        /* ---------- Dates part of Event Form ----------*/
        cy.get('#datesPartButton').click();

        cy.get('#addDateButton').click();
        cy.get('#eventDateBlocks-0-eventDates-1-eventDate')
            .click()
            .click()
            .type(moment().add(3, 'days').format('DD/MM/YYYY HH:mm'));
        cy.get('#eventDateBlocks-0-eventDates-1-annotation').type('Test Add New Date Edit');
        cy.get('#eventDateBlocks-0-eventDates-1-state').click();
        cy.get('#eventDateStateValue-valid').click();
        /* ---------- ---------- */

        /* ---------- Prices part of Event Form ----------*/
        cy.get('#pricesPartButton').click();

        cy.get('#addPriceButton').click();
        cy.get('#eventPriceBlocks-0-eventPrices-1-name').type('Test New Event Price Edit');
        cy.get('#eventPriceBlocks-0-eventPrices-1-price').type('100');
        cy.get('#eventPriceBlocks-0-eventPrices-1-annotation').type(
            'Test New Event Price Annotation'
        );
        /* ---------- ---------- */

        cy.get('#submitForm').click();

        cy.wait('@updateEvent').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
