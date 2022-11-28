import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    IMAGE_FORMATS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Contact Request Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + IMAGE_FORMATS_API_PATH).as('createImageFormat');
        cy.visit(Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Image Format', () => {
        cy.get('#name').type('New Image Format');

        cy.get('#length').type('500');
        cy.get('#height').type('500');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.wait('@createImageFormat').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Image Format (no name)', () => {
        cy.get('#name').focus().blur();

        cy.get('#length').type('500');
        cy.get('#height').type('500');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#name-helper-text').should('exist');
    });

    it('Create Image Format (no length)', () => {
        cy.get('#name').type('New Image Format');

        cy.get('#length').focus().blur();
        cy.get('#height').type('500');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#length-helper-text').should('exist');
    });

    it('Create Image Format (no height)', () => {
        cy.get('#name').type('New Image Format');

        cy.get('#length').type('500');
        cy.get('#height').focus().blur();
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#height-helper-text').should('exist');
    });
});
