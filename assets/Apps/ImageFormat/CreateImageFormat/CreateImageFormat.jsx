import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IMAGE_FORMATS_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { getImageFormatsAction } from '../../../redux/imageFormats/imageFormatSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import imageFormatsApi from '../../../services/api/imageFormatsApi';
import { ImageFormatForm } from '../ImageFormatForm/ImageFormatForm';

export const CreateImageFormat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await imageFormatsApi.createImageFormat(values);

        if (result.result) {
            NotificationManager.success('Le format a bien été créé.', 'Succès', REDIRECTION_TIME);

            dispatch(getImageFormatsAction());

            navigate(IMAGE_FORMATS_BASE_PATH);
        }
    };

    return <ImageFormatForm handleSubmit={handleSubmit} />;
};
