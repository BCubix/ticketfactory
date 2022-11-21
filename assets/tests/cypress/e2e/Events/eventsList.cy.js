import { EVENTS_BASE_PATH } from '../../../../Constant';
import {
    ADMIN_API_BASE_PATH,
    EVENTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Events List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('eventsActiveFilter');
        sessionStorage.removeItem('eventsNameFilter');
        sessionStorage.removeItem('eventsCategoryFilter');
        sessionStorage.removeItem('eventsRoomFilter');
        sessionStorage.removeItem('eventsSeasonFilter');
        sessionStorage.removeItem('eventsTagsFilter');
        sessionStorage.removeItem('eventsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + EVENTS_API_PATH + '*').as('getEvents');
        cy.visit(EVENTS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[name] = "Event")', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#nameFilterChip').click();
        cy.get('#nameFilterSearch').type('Event', { force: true, delay: 0 });

        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.name).contain('Event');
            });
        });
    });

    it('get List (filters[category] = "Accueil")', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#categoryFilterChip').click();
        cy.get('#categoryFilterValue-1').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.mainCategory.name).to.eq('Accueil');
            });
        });
    });

    it('get List (filters[room] = "Test Salle 1")', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#roomFilterChip').click();
        cy.get('#roomFilterSelect').click();
        cy.get('#roomFilterValue-1').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.room.id).to.eq(1);
            });
        });
    });

    it('get List (filters[season] = "Test Saison 1")', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#seasonFilterChip').click();
        cy.get('#seasonFilterSelect').click();
        cy.get('#seasonFilterValue-1').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.season.id).to.eq(1);
            });
        });
    });

    it('get List (filters[tag] = "Test Tag 1")', () => {
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#tagFilterChip').click();
        cy.get('#tagFilterSelect').click();
        cy.get('#tagFilterValue-1').click();
        cy.wait('@getEvents').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                const tagSearch = el.tags?.find((tag) => tag.id === 1) || null;
                expect(tagSearch).to.not.be.null;
            });
        });
    });
});
