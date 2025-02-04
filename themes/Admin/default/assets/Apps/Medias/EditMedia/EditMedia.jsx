import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';

import { getMediasAction } from '@Apps/Medias/redux/medias/mediasSlice';
import { userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getMediaType } from '@Services/utils/getMediaType';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { getUserRoles } from '@Services/utils/getUserRoles';

export const EditMedia = ({ id, editSuccess, onCancel, deleteElement, imageFormatList = [] }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(userProfileSelector);
    const [media, setMedia] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [mediaType, setMediaType] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);
    const [mediaParameterList, setMediaFormatList] = useState(null);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const accessUserDelete = useMemo(() => {
        return checkUserAccess(userRoles, 'ROLE_MEDIA_DELETE');
    }, [userRoles]);

    const getMedia = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getOneMedia(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                onCancel();
                return;
            }

            const idsImageFormat = result.media.imageFormats.map((format) => format.id);
            setMedia(result.media);
            setMediaFormatList(idsImageFormat.toString());
            setMediaType(getMediaType(result?.media?.documentType));
        });
    };

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.editMedia(id, values);

            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            NotificationManager.success('Votre fichier a bien été modifié', 'Succès', Constant.REDIRECTION_TIME);
            editSuccess();
            dispatch(getMediasAction());
        });
    };

    const handleEditImageSuccess = () => {
        setEditImage(false);

        getMedia();
        dispatch(getMediasAction());
    };

    useEffect(() => {
        if (!id) {
            onCancel();
            return;
        }

        getMedia();
    }, [id]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                onCancel();
            }

            setMediaCategoriesList(result.mediaCategories);
        });
    }, []);

    if (!media || !mediaCategoriesList) {
        return <></>;
    }

    return (
        <Grid container spacing={4} sx={{ mb: -4, minHeight: 300 }}>
            {editImage && mediaType === 'image' ? (
                <Component.MediaImageForm media={media} closeImageEditor={() => setEditImage(false)} editSuccess={handleEditImageSuccess} />
            ) : (
                <Component.MediaDataForm
                    media={media}
                    handleSubmit={handleSubmit}
                    deleteElement={() => deleteElement(id)}
                    mediaType={mediaType}
                    mediaCategoriesList={mediaCategoriesList}
                    setEditImage={setEditImage}
                    mediaParameterList={mediaParameterList}
                    setMediaFormatList={setMediaFormatList}
                    imageFormatList={imageFormatList}
                    userDeleteRight={accessUserDelete}
                />
            )}
        </Grid>
    );
};
