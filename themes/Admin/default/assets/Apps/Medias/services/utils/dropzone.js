import Dropzone from 'dropzone';
import $ from 'jquery';
import { NotificationManager } from 'react-notifications';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { getMediaType } from '@Services/utils/getMediaType';

var countChunk = 0;

export function intitializeDropzone({ logFail, onSuccess, id = null, setImageCounter, createUploadImageArray, maxFileSize, maxImageSize }) {
    $('.js-dropzone').each(function (_, element) {
        initDropzoneElement({ element, logFail, onSuccess, id, setImageCounter, createUploadImageArray, maxFileSize, maxImageSize });
    });
}

export const initDropzoneElement = ({ element, logFail, onSuccess, id, setImageCounter, createUploadImageArray, maxFileSize, maxImageSize }) => {
    if (!element) {
        return;
    }
    let dZone = new Dropzone(`#${element.id}`, {
        url: Constant.MEDIA_UPLOAD_URL,
        chunking: false,
        maxFilesize: 1048576,
        uploadMultiple: false,
        acceptedFiles: Constant.ALL_FILE_SUPPORTED,
        uploadprogress: function (file, progress, byteSent) {
            $(element).find('.dz-upload').width(`${progress}%`);
        },
        hiddenInputContainer: `#${element.id}`,
    });

    dZone.on('addedfile', async (file) => {
        let type = getMediaType(file.type);

        if (
            (type === 'image' && (maxImageSize || maxImageSize === 0) && file.size > maxImageSize * 1000000) ||
            (type !== 'image' && (maxFileSize || maxFileSize === 0) && file.size > maxFileSize * 1000000)
        ) {
            dZone.removeAllFiles();
            NotificationManager.error(type === 'image' ? 'Votre image est trop lourde' : 'Votre fichier est trop lourd', 'Erreur', Constant.REDIRECTION_TIME);
            return;
        }

        setImageCounter((prevCount) => prevCount + 1);
        const check = await checkAuth();

        if (!check) {
            return;
        }

        $(element).find('.js-dropzone-label').hide();
    });

    dZone.on('success', async function (file, response) {
        $(`#${element.id}_documentFileName`).val(`upload-${response.filename}`);
        countChunk -= 1;

        if (countChunk === 0) {
            $("button[type='submit']")[0].disabled = false;
        }

        if (onSuccess) {
            const data = {
                formatId: -1,
                deleteOldThumbnails: true,
            };
            createUploadImageArray(response.media);
        }
    });

    dZone.on('sending', (file, xhr, formData) => {
        let fileName = file.name.split('.');

        if (fileName.length > 1) {
            fileName.pop();
        }

        formData.append('fileName', fileName.join('.'));
        formData.append('type', file.type);
        formData.append('filePath', '/uploads/media');

        if (id) {
            formData.append('id', id);
        }
    });

    const checkAuth = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            logFail(check.error);

            return false;
        }

        dZone.options = {
            ...dZone.options,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        };

        return true;
    };
};
