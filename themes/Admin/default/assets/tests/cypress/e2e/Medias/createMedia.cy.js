import { Constant } from '../../../../AdminService/Constant';
import { ADMIN_API_BASE_PATH, IMAGE_UPLOAD_FILE_NAME, MEDIAS_UPLOAD_API_PATH, USER_EMAIL, USER_PASSWORD } from '../../../cypress.constant';

describe('Create Media Spec', () => {
    beforeEach(() => {
        cy.login(USER_EMAIL, USER_PASSWORD);

        cy.intercept('POST', ADMIN_API_BASE_PATH + MEDIAS_UPLOAD_API_PATH).as('createMedia');
        cy.visit(Constant.MEDIAS_BASE_PATH);
        cy.wait(500);
    });

    it('Create Media', () => {
        cy.get('#createMediaButton').click();

        cy.get('#dropzone input').attachFile(IMAGE_UPLOAD_FILE_NAME);

        cy.wait('@createMedia').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
        });
    });
});
