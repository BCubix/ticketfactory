import moment from 'moment';
import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    EVENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Event Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + EVENTS_API_PATH).as('createEvent');
        cy.visit(Constant.EVENTS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('create Event', () => {
        /* ---------- Main part of Event Form ----------*/
        cy.get('#name').type('New Event Title');
        cy.get('#chapo').type('New Event Chapo');
        cy.get('#descriptionControl').type('New Event Description');

        cy.get('#room').click();
        cy.get('#roomValue-1').click();

        cy.get('#season').click();
        cy.get('#seasonValue-1').click();

        cy.get('#eventCategoriesValue-1').click();
        cy.get('#mainCategoryValue-1').click();

        cy.get('#eventTags').click();
        cy.get('#eventTagsValue-1').click();
        cy.get('.MuiBackdrop-invisible').click();
        /* ---------- ---------- */

        /* ---------- Dates part of Event Form ----------*/
        cy.get('#datesPartButton').click();

        cy.get('#addDateButton').click();
        cy.get('#eventDateBlocks-0-eventDates-0-eventDate')
            .click()
            .click()
            .type(moment().add(2, 'days').format('DD/MM/YYYY HH:mm'));
        cy.get('#eventDateBlocks-0-eventDates-0-annotation').type('Test Event Date 1');
        cy.get('#eventDateBlocks-0-eventDates-0-state').click();
        cy.get('#eventDateStateValue-valid').click();
        /* ---------- ---------- */

        /* ---------- Prices part of Event Form ----------*/
        cy.get('#pricesPartButton').click();

        cy.get('#addPriceButton').click();
        cy.get('#eventPriceBlocks-0-eventPrices-0-name').type('Test Event Price 1');
        cy.get('#eventPriceBlocks-0-eventPrices-0-price').type('10');
        cy.get('#eventPriceBlocks-0-eventPrices-0-annotation').type(
            'Test Event Price 1 Annotation'
        );
        /* ---------- ---------- */

        /* ---------- Medias part of Event Form ----------*/
        cy.get('#mediasPartButton').click();
        cy.get('#imageMediasEvent-add').click();
        cy.get('#mediaEventAddElementValue-1').click();
        cy.get('#addRemoveFileMediaEvent').click();
        cy.get('#closeAddEventMediaModal').click();
        /* ---------- ---------- */

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.wait('@createEvent').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Verify main part Validation', () => {
        /* ---------- Main part of Event Form ----------*/
        cy.get('#name').focus().blur();
        cy.get('#name-helper-text').should('exist');
        cy.get('#name').type('New Event Title');

        cy.get('#chapo').focus().blur();
        cy.get('#chapo-helper-text').should('exist');
        cy.get('#chapo').type('New Event Chapo');

        cy.get('#descriptionControl .ck-content').focus().blur();
        cy.get('#description-helper-text').should('exist');
        cy.get('#descriptionControl').type('New Event Description');

        cy.get('#submitForm').click();

        // We test category after the submit because this is not a text input and to blur the input we must call the submit button
        cy.get('#eventCategories-helper-text').should('exist');
        cy.get('#mainCategory-helper-text').should('exist');
        /* ---------- ---------- */
    });

    it('Verify dates part Validation', () => {
        /* ---------- Date part of Event Form ----------*/
        cy.get('#datesPartButton').click();
        cy.get('#submitForm').click();

        cy.get('#eventDateBlocks-0-helper-text').should('exist');
        cy.get('#addDateButton').click();

        cy.get('#eventDateBlocks-0-eventDates-0-eventDate').click().click();
        cy.get('#eventDateBlocks-0-eventDates-0-eventDate-helper-text').should('exist');

        cy.get('#eventDateBlocks-0-eventDates-0-state').focus().blur();
        cy.get('#eventDateBlocks-0-eventDates-0-state-helper-text').should('exist');

        cy.get('#useEventDateGroup').click();
        cy.get('#removeEventDateBlock-0').click();
        cy.get('#removeEventDateBlock-0').click();

        //Check the helper text
        /* ---------- ---------- */
    });

    it('Verify prices part Validation', () => {
        /* ---------- Date part of Event Form ----------*/
        cy.get('#pricesPartButton').click();
        cy.get('#submitForm').click();

        cy.get('#eventPriceBlocks-0-helper-text').should('exist');
        cy.get('#addPriceButton').click();

        cy.get('#eventPriceBlocks-0-eventPrices-0-name').focus().blur();
        cy.get('#eventPriceBlocks-0-eventPrices-0-name-helper-text').should('exist');

        cy.get('#eventPriceBlocks-0-eventPrices-0-price').focus().blur();
        cy.get('#eventPriceBlocks-0-eventPrices-0-price-helper-text').should('exist');
        /* ---------- ---------- */
    });
});
