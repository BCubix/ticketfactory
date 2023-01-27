import { checkString } from '../services/utils/check';

const ConstantObj = {
    API_URL: 'http://localhost:8000/admin',
    FRONT_URL: 'http://localhost:8000',
    MEDIA_FILE_BASE_URL: 'http://localhost:8000',
    PARAMETER_FILE_BASE_URL: 'http://localhost:8000/uploads/parameter',
    MEDIA_UPLOAD_URL: '/admin/api/_uploader/media/upload',
    PARAMETERS_UPLOAD_URL: '/admin/api/_uploader/parameter/upload',
    MODULE_UPLOAD_URL: '/admin/api/_uploader/module/upload',
    THEME_UPLOAD_URL: '/admin/api/_uploader/theme/upload',
    ICONS_FILE_PATH: '/images/icons',
    LOGOS_FILE_PATH: '/images/logos',

    DEFAULT_LOGOS_FILE: '/TicketFactoryRougeHori.svg',

    REDIRECTION_TIME: 5000,

    HOME_PATH: '/admin',
    LOGIN_PATH: '/admin/connexion',
    FORGOT_PASSWORD_PATH: '/admin/mot-de-passe-oublie',
    MODIFY_PASSWORD_PATH: '/admin/modifier-mon-mot-de-passe',

    USER_BASE_PATH: '/admin/utilisateurs',
    PROFILE_BASE_PATH: '/admin/profil',
    EVENTS_BASE_PATH: '/admin/evenements',
    CATEGORIES_BASE_PATH: '/admin/categories',
    ROOMS_BASE_PATH: '/admin/salles',
    SEASONS_BASE_PATH: '/admin/saisons',
    LOGS_BASE_PATH: '/admin/logs',
    TAGS_BASE_PATH: '/admin/tags',
    MEDIAS_BASE_PATH: '/admin/medias',
    MEDIA_CATEGORIES_BASE_PATH: '/admin/categories-de-media',
    IMAGE_FORMATS_BASE_PATH: '/admin/image-formats',
    CONTENT_TYPES_BASE_PATH: '/admin/types-de-contenus',
    CONTENT_BASE_PATH: '/admin/contenus',
    CONTACT_REQUEST_BASE_PATH: '/admin/demandes-de-contact',
    REDIRECTIONS_BASE_PATH: '/admin/redirections',
    MENUS_BASE_PATH: '/admin/menus',
    PAGES_BASE_PATH: '/admin/pages',
    PAGE_BLOCKS_BASE_PATH: '/admin/page-blocks',
    PAGE_HISTORY_BASE_PATH: '/admin/historique-de-page',
    PARAMETERS_BASE_PATH: '/admin/parametres',
    LANGUAGES_BASE_PATH: '/admin/langues',
    MODULES_BASE_PATH: '/admin/modules',
    THEMES_BASE_PATH: '/admin/themes',
    HOOKS_BASE_PATH: '/admin/hooks',

    EDIT_PATH: '/modifier',
    CREATE_PATH: '/nouveau',

    MEDIA_FILE_PATH: '/uploads/media',

    IMAGE_FILE_SUPPORTED: 'image/jpeg, image/png, image/gif, image/webp',
    AUDIO_FILE_SUPPORTED: 'audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav',
    VIDEO_FILE_SUPPORTED: 'video/mp4, video/webm, video/ogg, video/mpeg',
    WORD_FILE_SUPPORTED: 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    EXCEL_FILE_SUPPORTED: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    POWERPOINT_FILE_SUPPORTED: 'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
    PDF_FILE_SUPPORTED: 'application/pdf',
    TEXT_FILE_SUPPORTED: 'text/plain',
    ZIP_FILE_SUPPORTED: 'application/zip, application/x-zip-compressed',

    REDIRECTION_TYPES: [
        { label: 'Permanente (301)', value: 301 },
        { label: 'Temporaire (302)', value: 302 },
    ],

    CONTENT_TYPE_MODULES_EXTENSION: 'FieldType',
    CONTENT_MODULES_EXTENSION: 'FieldContentType',

    CANCELED_REQUEST_ERROR_CODE: 'ERR_CANCELED',

    USER_ROLES: [
        { label: 'Utilisateur', value: 'ROLE_USER' },
        { label: 'Admin', value: 'ROLE_ADMIN' },
    ],

    PAGE_BLOCKS_FORMATS: [[12], [6, 6], [4, 8], [8, 4], [4, 4, 4], [3, 6, 3]],
};

ConstantObj.ALL_FILE_SUPPORTED = () =>
    `${ConstantObj.IMAGE_FILE_SUPPORTED}, ${ConstantObj.AUDIO_FILE_SUPPORTED}, ${ConstantObj.VIDEO_FILE_SUPPORTED}, ${ConstantObj.WORD_FILE_SUPPORTED}, ${ConstantObj.EXCEL_FILE_SUPPORTED}, ${ConstantObj.POWERPOINT_FILE_SUPPORTED}, ${ConstantObj.PDF_FILE_SUPPORTED}, ${ConstantObj.TEXT_FILE_SUPPORTED}`;

/**
 * Constant's getter.
 */
export const Constant = new Proxy(ConstantObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Constant.`);
        }

        const result = Reflect.get(target, key, receiver);
        return typeof result === 'function' && (result.name === '' || result.name === 'ALL_FILE_SUPPORTED') ? result() : result;
    },
});

/**
 * Constant's setter.
 *
 * @param  {string} name
 * @param  {*}      constant
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setConstant(name, constant) {
    checkString(name);

    ConstantObj[name] = constant;
}
