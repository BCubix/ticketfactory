import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    USERS_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Users List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('usersActiveFilter');
        sessionStorage.removeItem('usersEmailFilter');
        sessionStorage.removeItem('usersFirstNameFilter');
        sessionStorage.removeItem('usersLastNameFilter');
        sessionStorage.removeItem('usersRoleFilter');
        sessionStorage.removeItem('usersSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + USERS_API_PATH + '*').as('getUsers');
        cy.visit(Constant.USER_BASE_PATH);
        cy.wait(500);
    });

    it('get List', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });
    });

    it('get List (filters[active] = false)', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-False').click();
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(false);
            });
        });
    });

    it('get List (filters[active] = true)', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#activeFilterChip').click();
        cy.get('#activeFilterValue-True').click();
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            response?.body?.results?.forEach((el) => {
                expect(el.active).to.eq(true);
            });
        });
    });

    it('get List (filters[firstName] = "FirstName")', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#firstNameFilterChip').click();
        cy.get('#firstNameFilterSearch').type('FirstName', { delay: 0 });

        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.firstName).contain('FirstName');
            });
        });
    });

    it('get List (filters[lastName] = "LastName")', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#lastNameFilterChip').click();
        cy.get('#lastNameFilterSearch').type('LastName', { delay: 0 });

        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.lastName).contain('LastName');
            });
        });
    });

    it('get List (filters[email] = "email@gmail.com")', () => {
        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            expect(response.body.total).to.greaterThan(0);
        });

        cy.get('#emailFilterChip').click();
        cy.get('#emailFilterSearch').type('email@gmail.com', { delay: 0 });

        cy.wait('@getUsers').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.results?.length).to.greaterThan(0);
            response?.body?.results?.forEach((el) => {
                expect(el.email).contain('email@gmail.com');
            });
        });
    });
});
