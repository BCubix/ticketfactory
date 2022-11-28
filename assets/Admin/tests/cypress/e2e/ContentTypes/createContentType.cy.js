import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    CONTENT_TYPES_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Content Type Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + CONTENT_TYPES_API_PATH).as('createContentType');
        cy.visit(Constant.CONTENT_TYPES_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Content Type', () => {
        cy.get('#name').type('New Content type');

        cy.get('#addField').click();
        cy.get('#fields-0-title').type('New field');
        cy.get('#fields-0-name').type('newField');
        cy.get('#fields-0-helper').type('New instruction');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.wait('@createContentType').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Content Type (no name)', () => {
        cy.get('#name').focus().blur();

        cy.get('#addField').click();
        cy.get('#fields-0-title').type('New field');
        cy.get('#fields-0-name').type('newField');
        cy.get('#fields-0-helper').type('New instruction');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#name-helper-text').should('exist');
    });

    it('Create Content Type (no Field)', () => {
        cy.get('#name').type('New Content type');
        cy.get('[type="submit"]').click();

        cy.get('#fields-helper-text').should('exist');
    });

    it('Create Content Type (no title into first field)', () => {
        cy.get('#name').type('New Content type');

        cy.get('#addField').click();
        cy.get('#fields-0-title').focus().blur();
        cy.get('#fields-0-name').type('newField');
        cy.get('#fields-0-helper').type('New instruction');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#fields-0-title-helper-text').should('exist');
    });

    it('Create Content Type (no name into first field)', () => {
        cy.get('#name').type('New Content type');

        cy.get('#addField').click();
        cy.get('#fields-0-title').type('New field');
        cy.get('#fields-0-name').focus().blur();
        cy.get('#fields-0-helper').type('New instruction');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#fields-0-name-helper-text').should('exist');
    });

    it('Create Content Type (change field type into first field (Email))', () => {
        cy.get('#name').type('New Content type');

        cy.get('#addField').click();
        cy.get('#fields-0-title').type('New field');
        cy.get('#fields-0-name').type('newField');
        cy.get('#fields-0-typeSelect').click();
        cy.get('#fields-0-typeValue-3').click();
        cy.get('#fields-0-helper').type('New instruction');
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.wait('@createContentType').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });
});
