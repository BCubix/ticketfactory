import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, IMAGE_FORMATS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Image Format Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('imageFormatsActiveFilter');
        sessionStorage.removeItem('imageFormatsNameFilter');
        sessionStorage.removeItem('imageFormatsSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + IMAGE_FORMATS_API_PATH + '*').as('getList');
        cy.visit(Constant.IMAGE_FORMATS_BASE_PATH);
        cy.wait(500);
    });

    it('Delete Image Format', () => {
        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${IMAGE_FORMATS_API_PATH}/${id}`).as('deleteImageFormat');

            cy.get(`#deleteButton-${id}`).click();
            cy.get('#validateDeleteDialog').click();

            cy.wait('@deleteImageFormat').then(({ response }) => {
                expect(response.statusCode).to.eq(204);
            });
        });
    });
});
