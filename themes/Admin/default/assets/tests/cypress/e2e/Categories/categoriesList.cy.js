import { Constant } from '../../../../AdminService/Constant';
import {
    ADMIN_API_BASE_PATH,
    CATEGORIES_API_PATH,
    USER_EMAIL,
    USER_PASSWORD,
} from '../../../cypress.constant';

describe('Categories List Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('GET', ADMIN_API_BASE_PATH + CATEGORIES_API_PATH).as('getCategories');
        cy.visit(Constant.CATEGORIES_BASE_PATH);
    });

    it('get List', () => {
        cy.wait('@getCategories').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.id).to.eq(1);
        });
    });

    it('get List children of main category', () => {
        cy.wait('@getCategories').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.id).to.eq(1);
            expect(response.body.children.length).to.greaterThan(0);

            let id = response.body.children.at(0).id;

            cy.intercept('GET', `${ADMIN_API_BASE_PATH}${CATEGORIES_API_PATH}/${id}`).as(
                'getOneSpecificCategory'
            );

            cy.get(`#tableElement-${id}`).click();
            cy.wait('@getOneSpecificCategory').then(({ response }) => {
                expect(response.statusCode).to.eq(200);
                expect(response.body.id).to.eq(id);
            });
        });
    });
});
