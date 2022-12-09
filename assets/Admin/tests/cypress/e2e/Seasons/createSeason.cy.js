import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    SEASONS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Season Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + SEASONS_API_PATH).as('createSeason');
        cy.visit(Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Seasons', () => {
        cy.get('#name').type('New Season');
        cy.get('#beginYear').type('2022');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.wait('@createSeason').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Seasons (no name)', () => {
        cy.get('#name').focus().blur();
        cy.get('#beginYear').type('2022');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#name-helper-text').should('exist');
    });

    it('Create Seasons (bad beginYear before 1970)', () => {
        cy.get('#name').type('New Season');
        cy.get('#beginYear').type('1960');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#beginYear-helper-text').should('exist');
    });

    it('Create Seasons (bad beginYear after 2100)', () => {
        cy.get('#name').type('New Season');
        cy.get('#beginYear').type('2110');
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#beginYear-helper-text').should('exist');
    });

    it('Create Seasons (no beginYear)', () => {
        cy.get('#name').type('New Season');
        cy.get('#beginYear').focus().blur();
        cy.get('#active').click();

        cy.get('#submitForm').click();

        cy.get('#beginYear-helper-text').should('exist');
    });
});
