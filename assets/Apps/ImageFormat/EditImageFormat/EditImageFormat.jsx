import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IMAGE_FORMATS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getImageFormatsAction } from '../../../redux/imageFormats/imageFormatSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import imageFormatsApi from '../../../services/api/imageFormatsApi';
import { ImageFormatForm } from '../ImageFormatForm/ImageFormatForm';

export const EditImageFormat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageFormat, setImageFormat] = useState(null);

    const getImageFormat = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await imageFormatsApi.getOneImageFormat(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(IMAGE_FORMATS_BASE_PATH);

            return;
        }

        setImageFormat(result.imageFormat);
    };

    useEffect(() => {
        if (!id) {
            navigate(IMAGE_FORMATS_BASE_PATH);
            return;
        }

        getImageFormat(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await imageFormatsApi.editImageFormat(id, values);

        if (result.result) {
            NotificationManager.success(
                'Le format à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getImageFormatsAction());

            navigate(IMAGE_FORMATS_BASE_PATH);
        }
    };

    if (!imageFormat) {
        return <></>;
    }

    return <ImageFormatForm handleSubmit={handleSubmit} initialValues={imageFormat} />;
};
