import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Button, Grid } from '@mui/material';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getMediasAction } from '@Redux/medias/mediasSlice';
import { loginFailure } from '@Redux/profile/profileSlice';

import { getMediaType } from '@Services/utils/getMediaType';

export const EditMedia = ({ id, editSuccess, onCancel, deleteElement }) => {
    const dispatch = useDispatch();
    const [media, setMedia] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [mediaType, setMediaType] = useState(null);

    const getMedia = async () => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.mediasApi.getOneMedia(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            onCancel();

            return;
        }

        setMedia(result.media);
        setMediaType(getMediaType(result?.media?.documentType));
    };

    const handleSubmit = async (values) => {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.mediasApi.editMedia(id, values);

        if (!result.result) {
            return;
        }

        NotificationManager.success('Votre fichier a bien été modifié', 'Succès', Constant.REDIRECTION_TIME);

        editSuccess();
        dispatch(getMediasAction());

        return;
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

    if (!media) {
        return <></>;
    }

    return (
        <Grid container spacing={4} sx={{ mb: -4, minHeight: 300 }}>
            {editImage && mediaType === 'image' ? (
                <Component.MediaImageForm
                    media={media}
                    closeImageEditor={() => setEditImage(false)}
                    editSuccess={handleEditImageSuccess}
                />
            ) : (
                <>
                    <Grid
                        item
                        sx={{ mt: 4, mb: 4 }}
                        xs={12}
                        sm={6}
                        md={7}
                        display="flex"
                        flexDirection={'column'}
                        alignItems={'center'}
                    >
                        <Component.CmtDisplayMediaType
                            media={media}
                            maxWidth={'50%'}
                            maxHeight={200}
                            sx={{ objectFit: 'contain' }}
                        />

                        {mediaType === 'image' && (
                            <Button
                                sx={{ mt: 5 }}
                                variant={'contained'}
                                color="primary"
                                onClick={() => setEditImage(true)}
                            >
                                Modifier l'image
                            </Button>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6} md={5} sx={{ borderLeft: '1px solid #D3D3D3' }}>
                        <Component.MediaDataForm
                            media={media}
                            handleSubmit={handleSubmit}
                            deleteElement={() => deleteElement(id)}
                            mediaType={mediaType}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
};
