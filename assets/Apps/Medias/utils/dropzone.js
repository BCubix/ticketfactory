import authApi from '../../../services/api/authApi';
import Dropzone from 'dropzone';
import $ from 'jquery';

var countChunk = 0;

export function intitializeDropzone({ logFail, onSuccess, id = null }) {
    $('.js-dropzone').each(function (_, element) {
        initDropzoneElement({ element, logFail, onSuccess, id });
    });
}

export const initDropzoneElement = ({ element, logFail, onSuccess, id }) => {
    if (!element) {
        return;
    }

    let dZone = new Dropzone(`#${element.id}`, {
        url: '/admin/api/_uploader/media/upload',
        chunking: true,
        maxFilesize: 10000000000,
        chunkSize: 1000000,
        uploadMultiple: false,
        parallelUploads: 1,
        acceptedFiles: 'image/png,image/jpg,image/jpeg,application/pdf',
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
            onSuccess();
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
            formData.append('id', 10);
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
