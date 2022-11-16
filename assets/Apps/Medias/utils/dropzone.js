import Dropzone from 'dropzone';
import $ from 'jquery';
import { Api } from "@/AdminService/Api";
import { Constant } from "@/AdminService/Constant";

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
        url: Constant.MEDIA_UPLOAD_URL,
        chunking: false,
        maxFilesize: 1048576,
        uploadMultiple: false,
        acceptedFiles: Constant.ALL_FILE_SUPPORTED,
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
