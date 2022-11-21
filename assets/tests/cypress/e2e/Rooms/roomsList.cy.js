import { ROOMS_BASE_PATH } from '../../../../Constant';
import {
    ADMIN_API_BASE_PATH,
    ROOMS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Rooms List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('roomsActiveFilter');
        sessionStorage.removeItem('roomsNameFilter');
        sessionStorage.removeItem('roomsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + ROOMS_API_PATH + '*').as('getRooms');
        cy.visit(ROOMS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[name] = "Test Salle 1")', () => {
        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#nameFilterChip').click();
        cy.get('#nameFilterSearch').type('Test Salle 1', { force: true, delay: 0 });

        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.name).contain('Test Salle 1');
            });
        });
    });
});
