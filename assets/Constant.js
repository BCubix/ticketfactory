export const API_URL = 'http://localhost:8000/admin';
export const MEDIA_FILE_BASE_URL = 'http://localhost:8000';
export const PARAMETER_FILE_BASE_URL = 'http://localhost:8000/uploads/parameter';
export const MEDIA_UPLOAD_URL = '/admin/api/_uploader/media/upload';
export const PARAMETERS_UPLOAD_URL = '/admin/api/_uploader/parameter/upload';
export const ICONS_FILE_PATH = '/images/icons';

export const REDIRECTION_TIME = 5000;

export const HOME_PATH = '/admin';
export const LOGIN_PATH = '/admin/connexion';
export const FORGOT_PASSWORD_PATH = '/admin/mot-de-passe-oublie';
export const MODIFY_PASSWORD_PATH = '/admin/modifier-mon-mot-de-passe';

export const USER_BASE_PATH = '/admin/utilisateurs';
export const EVENTS_BASE_PATH = '/admin/evenements';
export const CATEGORIES_BASE_PATH = '/admin/categories';
export const ROOMS_BASE_PATH = '/admin/salles';
export const SEASONS_BASE_PATH = '/admin/saisons';
export const LOGS_BASE_PATH = '/admin/logs';
export const TAGS_BASE_PATH = '/admin/tags';
export const MEDIAS_BASE_PATH = '/admin/medias';
export const IMAGE_FORMATS_BASE_PATH = '/admin/image-formats';
export const CONTENT_TYPES_BASE_PATH = '/admin/types-de-contenus';
export const CONTENT_BASE_PATH = '/admin/contenus';
export const CONTACT_REQUEST_BASE_PATH = '/admin/demandes-de-contact';
export const REDIRECTIONS_BASE_PATH = '/admin/redirections';
export const MENUS_BASE_PATH = '/admin/menus';
export const PAGES_BASE_PATH = '/admin/pages';
export const PARAMETERS_BASE_PATH = '/admin/parametres';

export const EDIT_PATH = '/modifier';
export const CREATE_PATH = '/nouveau';

export const MEDIA_FILE_PATH = '/uploads/media';

export const IMAGE_FILE_SUPPORTED = 'image/jpeg, image/png, image/gif, image/webp';

export const AUDIO_FILE_SUPPORTED = 'audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav';

export const VIDEO_FILE_SUPPORTED = 'video/mp4, video/webm, video/ogg, video/mpeg';

export const WORD_FILE_SUPPORTED =
    'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const EXCEL_FILE_SUPPORTED =
    'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const POWERPOINT_FILE_SUPPORTED =
    'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation';

export const PDF_FILE_SUPPORTED = 'application/pdf';

export const TEXT_FILE_SUPPORTED = 'text/plain';

export const ALL_FILE_SUPPORTED = `${IMAGE_FILE_SUPPORTED}, ${AUDIO_FILE_SUPPORTED}, ${VIDEO_FILE_SUPPORTED}, ${WORD_FILE_SUPPORTED}, ${EXCEL_FILE_SUPPORTED}, ${POWERPOINT_FILE_SUPPORTED}, ${PDF_FILE_SUPPORTED}, ${TEXT_FILE_SUPPORTED}`;

export const REDIRECTION_TYPES = [
    { label: 'Permanente (301)', value: 301 },
    { label: 'Temporaire (302)', value: 302 },
];

export const CONTENT_TYPE_MODULES_EXTENSION = 'FieldType';
export const CONTENT_MODULES_EXTENSION = 'FieldContentType';

export const CANCELED_REQUEST_ERROR_CODE = 'ERR_CANCELED';
