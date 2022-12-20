import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, IMAGE_FORMATS_API_PATH, SEASONS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Update Image Format Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('imageFormatsActiveFilter');
        sessionStorage.removeItem('imageFormatsNameFilter');
        sessionStorage.removeItem('imageFormatsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + IMAGE_FORMATS_API_PATH + '*').as('getList');
        cy.visit(Constant.IMAGE_FORMATS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('POST', `${ADMIN_API_BASE_PATH}${IMAGE_FORMATS_API_PATH}/${id}`).as('updateImageFormat');

            cy.get(`#editButton-${id}`).click();
        });
    });

    it('Update Image Format', () => {
        cy.get('#name').clear().type('New Image Format Edit');
        cy.get('#length').clear().type('250');
        cy.get('#height').clear().type('250');

        cy.get('#submitForm').click();

        cy.wait('@updateImageFormat').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
