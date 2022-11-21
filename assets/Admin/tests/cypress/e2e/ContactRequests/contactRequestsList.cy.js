import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    CONTACT_REQUESTS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Redirections List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('contactRequestsActiveFilter');
        sessionStorage.removeItem('contactRequestsFirstNameFilter');
        sessionStorage.removeItem('contactRequestsLastNameFilter');
        sessionStorage.removeItem('contactRequestsEmailFilter');
        sessionStorage.removeItem('contactRequestsPhoneFilter');
        sessionStorage.removeItem('contactRequestsSubjectFilter');
        sessionStorage.removeItem('contactRequestsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + CONTACT_REQUESTS_API_PATH + '*').as(
            'getContactRequests'
        );
        cy.visit(Constant.CONTACT_REQUEST_BASE_PATH);
        cy.wait(500);
    });

    it('get List', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[firstName] = "FirstName")', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#firstNameFilterChip').click();
        cy.get('#firstNameFilterSearch').type('FirstName', { delay: 0 });

        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.firstName).contain('FirstName');
            });
        });
    });

    it('get List (filters[lastName] = "LastName")', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#lastNameFilterChip').click();
        cy.get('#lastNameFilterSearch').type('LastName', { delay: 0 });

        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.lastName).contain('LastName');
            });
        });
    });

    it('get List (filters[email] = "email@gmail.com")', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#emailFilterChip').click();
        cy.get('#emailFilterSearch').type('email@gmail.com', { delay: 0 });

        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.email).contain('email@gmail.com');
            });
        });
    });

    it('get List (filters[phone] = "0600000000")', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#phoneFilterChip').click();
        cy.get('#phoneFilterSearch').type('0600000000', { delay: 0 });

        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.phone).contain('0600000000');
            });
        });
    });

    it('get List (filters[subject] = "Subject")', () => {
        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#subjectFilterChip').click();
        cy.get('#subjectFilterSearch').type('Subject', { delay: 0 });

        cy.wait('@getContactRequests').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.subject).contain('Subject');
            });
        });
    });
});
