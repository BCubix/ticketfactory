import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    LOCAL_URL,
    REDIRECTIONS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Create Redirection Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + REDIRECTIONS_API_PATH).as('createRedirection');
        cy.visit(Constant.REDIRECTIONS_BASE_PATH + Constant.CREATE_PATH);
        cy.wait(500);
    });

    it('Create Redirection', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').type(`${LOCAL_URL}/admin/`);
        cy.get('#redirectTo').type(`${LOCAL_URL}/admin/evenements`);
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.wait('@createRedirection').then(({ response }) => {
            expect(response.statusCode).to.eq(201);
        });
    });

    it('Create Redirection (bad redirectFrom)', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').type(`/admin/`);
        cy.get('#redirectTo').type(`${LOCAL_URL}/admin/evenements`);
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#redirectFrom-helper-text').should('exist');
    });

    it('Create Redirection (no redirectFrom)', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').focus().blur();
        cy.get('#redirectTo').type(`${LOCAL_URL}/admin/evenements`);
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#redirectFrom-helper-text').should('exist');
    });

    it('Create Redirection (bad redirectTo)', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').type(`${LOCAL_URL}/admin/`);
        cy.get('#redirectTo').type(`/admin/evenements`);
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#redirectTo-helper-text').should('exist');
    });

    it('Create Redirection (no redirectTo)', () => {
        cy.get('#redirectionType').click();
        cy.get('#redirectionTypeValue-301').click();
        cy.get('#redirectFrom').type(`${LOCAL_URL}/admin/`);
        cy.get('#redirectTo').focus().blur();
        cy.get('#active').click();

        cy.get('[type="submit"]').click();

        cy.get('#redirectTo-helper-text').should('exist');
    });
});
