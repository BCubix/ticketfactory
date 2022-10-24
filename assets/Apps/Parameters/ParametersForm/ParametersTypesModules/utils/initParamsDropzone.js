import Dropzone from 'dropzone';
import $ from 'jquery';
import authApi from '@Services/api/authApi';
import { ALL_FILE_SUPPORTED } from '@/Constant';
import { PARAMETERS_UPLOAD_URL } from '../../../../../Constant';

var countChunk = 0;

export function intitializeParamsDropzone({
    logFail,
    onSuccess,
    id = null,
    dropzoneId,
    fileType,
    maxWeight,
}) {
    $(`#${dropzoneId}`)?.each(function (_, element) {
        initParamsDropzoneElement({ element, logFail, onSuccess, id, fileType, maxWeight });
    });
}

export const initParamsDropzoneElement = ({
    element,
    logFail,
    onSuccess,
    id,
    fileType,
    maxWeight,
}) => {
    if (!element) {
        return;
    }

    let dZone = new Dropzone(`#${element.id}`, {
        url: PARAMETERS_UPLOAD_URL,
        chunking: false,
        maxFilesize: maxWeight || 1048576,
        uploadMultiple: false,
        acceptedFiles: fileType || ALL_FILE_SUPPORTED,
        uploadprogress: function (file, progress, byteSent) {
            $(element).find('.dz-upload').width(`${progress}%`);
        },
    });

    dZone.on('addedfile', async (file) => {
        const check = await checkAuth();

        if (!check) {
            return;
        }

        $(element).find('.js-dropzone-label').hide();
    });

    dZone.on('success', function (file, response) {
        $(`#${element.id}_documentFileName`).val(`upload-${response.filename}`);

        countChunk -= 1;

        if (countChunk === 0) {
            $("button[type='submit']")[0].disabled = false;
        }

        if (onSuccess) {
            onSuccess(response);
        }
    });

    dZone.on('sending', (file, xhr, formData) => {
        let fileName = file.name.split('.');

        if (fileName.length > 1) {
            fileName.pop();
        }

        formData.append('fileName', fileName.join('.'));
        formData.append('type', file.type);

        if (id) {
            formData.append('id', id);
        }
    });

    const checkAuth = async () => {
        const check = await authApi.checkIsAuth();

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
