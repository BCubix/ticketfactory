import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, MEDIAS_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Delete Media Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        sessionStorage.removeItem('mediasActiveFilter');
        sessionStorage.removeItem('mediasTitleFilter');
        sessionStorage.removeItem('mediasDocumentTypeFilter');
        sessionStorage.removeItem('mediasSort');

        cy.intercept('GET', ADMIN_API_BASE_PATH + MEDIAS_API_PATH + '*').as('getList');
        cy.visit(Constant.MEDIAS_BASE_PATH);
        cy.wait(500);

        cy.wait('@getList').then(({ response }) => {
            expect(response.statusCode).to.eq(200);

            let arr = response.body?.results?.map((el) => el.id);
            let id = Math.max(...arr);

            cy.intercept('DELETE', `${ADMIN_API_BASE_PATH}${MEDIAS_API_PATH}/${id}`).as('deleteMedias');

            cy.get(`#mediaItem-${id}`).click();
        });
    });

    it('Delete Media', () => {
        cy.get('#deleteButton').click();
        cy.get('#validateDeleteDialog').click();

        cy.wait('@deleteMedias').then(({ response }) => {
            expect(response.statusCode).to.eq(204);
        });
    });
});
