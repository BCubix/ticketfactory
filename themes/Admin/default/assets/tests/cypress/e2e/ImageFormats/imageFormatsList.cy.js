import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    IMAGE_FORMATS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Redirections List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('imageFormatsActiveFilter');
        sessionStorage.removeItem('imageFormatsNameFilter');
        sessionStorage.removeItem('imageFormatsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + IMAGE_FORMATS_API_PATH + '*').as(
            'getImageFormats'
        );
        cy.visit(Constant.IMAGE_FORMATS_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[name] = "Test Media 1")', () => {
        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#nameFilterChip').click();
        cy.get('#nameFilterSearch').type('Test Image Format 1', { force: true, delay: 0 });

        cy.wait('@getImageFormats').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.name).contain('Test Image Format 1');
            });
        });
    });
});
