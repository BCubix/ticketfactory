import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    ROOMS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Room Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + ROOMS_API_PATH).as('createRoom');
        cy.visit(Constant.ROOMS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Room', () => {
        cy.get('#name').type('New Room');
        cy.get('#seatsNb').type('50');
        cy.get('#area').type('100');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').type('New Plan 1');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.wait('@createRoom').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Room (no name)', () => {
        cy.get('#name').focus().blur();
        cy.get('#seatsNb').type('50');
        cy.get('#area').type('100');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').type('New Plan 1');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.get('#name-helper-text').should('exist');
    });

    it('Create Room (bad seatsNb)', () => {
        cy.get('#name').type('New Room');
        cy.get('#seatsNb').type('TEST');
        cy.get('#area').type('100');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').type('New Plan 1');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.get('#seatsNb-helper-text').should('exist');
    });

    it('Create Room (no seatsNb)', () => {
        cy.get('#name').type('New Room');
        cy.get('#seatsNb').focus().blur();
        cy.get('#area').type('100');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').type('New Plan 1');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.get('#seatsNb-helper-text').should('exist');
    });

    it('Create Room (bad area)', () => {
        cy.get('#name').type('New Room');
        cy.get('#seatsNb').type('50');
        cy.get('#area').type('TEST');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').type('New Plan 1');

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.get('#area-helper-text').should('exist');
    });

    it('Create Room (no name into first plan)', () => {
        cy.get('#name').type('New Room');
        cy.get('#seatsNb').type('50');
        cy.get('#area').type('100');

        cy.get('#addSeatingPlan').click();
        cy.get('#seatingPlans-0-name').focus().blur();

        cy.get('#active').click();
        cy.get('#submitForm').click();

        cy.get('#seatingPlans-0-name-helper-text').should('exist');
    });
});
