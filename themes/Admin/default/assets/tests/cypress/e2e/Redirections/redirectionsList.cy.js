import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    REDIRECTIONS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Redirections List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('redirectionsActiveFilter');
        sessionStorage.removeItem('redirectionsRedirectTypeFilter');
        sessionStorage.removeItem('redirectionsRedirectFromFilter');
        sessionStorage.removeItem('redirectionsRedirectToFilter');
        sessionStorage.removeItem('redirectionsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + REDIRECTIONS_API_PATH + '*').as(
            'getRedirections'
        );
        cy.visit(Constant.REDIRECTIONS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[type] = "Permanente (301)")', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#redirectionTypeFilterChip').click();
        cy.get('#redirectionTypeFilterSelect').click();
        cy.get('#redirectionTypeFilterValue-301').click();

        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.redirectType).to.eq(301);
            });
        });
    });

    it('get List (filters[type] = "Temporaire (302)")', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#redirectionTypeFilterChip').click();
        cy.get('#redirectionTypeFilterSelect').click();
        cy.get('#redirectionTypeFilterValue-302').click();

        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.redirectType).to.eq(302);
            });
        });
    });

    it('get List (filters[redirectFrom] = "/evenements")', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#redirectFromFilterChip').click();
        cy.get('#redirectFromFilterSearch').type('/evenements', { delay: 0 });

        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.redirectFrom).contain('/evenements');
            });
        });
    });

    it('get List (filters[redirectTo] = "/evenements")', () => {
        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#redirectToFilterChip').click();
        cy.get('#redirectToFilterSearch').type('/evenements', { delay: 0 });

        cy.wait('@getRedirections').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.redirectTo).contain('/evenements');
            });
        });
    });
});
