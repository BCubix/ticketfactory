import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    MEDIAS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Redirections List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('mediasActiveFilter');
        sessionStorage.removeItem('mediasTitleFilter');
        sessionStorage.removeItem('mediasDocumentTypeFilter');
        sessionStorage.removeItem('mediasSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + MEDIAS_API_PATH + '*').as('getMedias');
        cy.visit(Constant.MEDIAS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[title] = "Test Media 1")', () => {
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#titleFilterChip').click();
        cy.get('#titleFilterSearch').type('Test Media 1', { force: true, delay: 0 });

        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.title).contain('Test Media 1');
            });
        });
    });

    it('get List (filters[documentType] = Image)', () => {
        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#mediaDocumentTypeFilterChip').click();
        cy.get('#mediaDocumentTypeFilterSelect').click();
        cy.get('#mediaDocumentTypeFilterValue-image').click();

        cy.wait('@getMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.documentType).contain('image');
            });
        });
    });
});
