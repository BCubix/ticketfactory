import { CONTENT_BASE_PATH } from '../../../../Constant';
import {
    ADMIN_API_BASE_PATH,
    CONTENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Redirections List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contentsActiveFilter');
        sessionStorage.removeItem('contentsTitleFilter');
        sessionStorage.removeItem('contentsContentTypeFilter');
        sessionStorage.removeItem('contentsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTENTS_API_PATH + '*').as('getContents');
        cy.visit(CONTENT_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[title] = "Test Content 1")', () => {
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#titleFilterChip').click();
        cy.get('#titleFilterSearch').type('Test Content 1', { force: true, delay: 0 });

        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.title).contain('Test Content 1');
            });
        });
    });

    it('get List (filters[contentType] = (id = 1))', () => {
        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#contentTypeFilterChip').click();
        cy.get('#contentTypeFilterSelect').click();
        cy.get('#contentTypeFilterValue-1').click();

        cy.wait('@getContents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.contentType.id).to.eq(1);
            });
        });
    });
});
