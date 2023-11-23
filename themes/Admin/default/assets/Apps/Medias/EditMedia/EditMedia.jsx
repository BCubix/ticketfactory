import { apiMiddleware } from '@Services/utils/apiMiddleware';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Button, Grid } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMediasAction } from '@Apps/Medias/redux/medias/mediasSlice';

import { getMediaType } from '@Services/utils/getMediaType';

export const EditMedia = ({ id, editSuccess, onCancel, deleteElement }) => {
    const dispatch = useDispatch();
    const [media, setMedia] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [mediaType, setMediaType] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);
    const [mediaParameterList, setMediaFormatList] = useState(null);
    const [imageFormatList, setImageFormatList] = useState([]);

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

            Api.imageFormatsApi.getAllImageFormat({ active: true }).then((result) => {
                if (result.result) {
                    setImageFormatList(result.imageFormats);
                } else {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur');
                    onCancel();
                }
            });
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
                />
            )}
        </Grid>
    );
};
