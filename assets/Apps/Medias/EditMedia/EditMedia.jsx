import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { REDIRECTION_TIME } from '../../../Constant';
import { getMediasAction } from '../../../redux/medias/mediasSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import mediasApi from '../../../services/api/mediasApi';
import { DisplayMediaType } from '../Components/DisplayMediaType';
import { MediaDataForm } from './MediaDataForm';

export const EditMedia = ({ id, editSuccess, onCancel }) => {
    const dispatch = useDispatch();
    const [media, setMedia] = useState(null);

    const getMedia = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await mediasApi.getOneMedia(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            onCancel();

            return;
        }

        setMedia(result.media);
    };

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await mediasApi.editMedia(id, values);

        if (!result.result) {
            return;
        }

        NotificationManager.success('Votre fichier à bien été modifié', 'Succès', REDIRECTION_TIME);

        editSuccess();

        dispatch(getMediasAction());

        return;
    };

    useEffect(() => {
        if (!id) {
            onCancel();
        }

        getMedia();
    }, [id]);

    if (!media) {
        return <></>;
    }

    return (
        <Grid container spacing={4} sx={{ mb: -4, minHeight: 300 }}>
            <Grid
                item
                sx={{ mt: 4, mb: 4 }}
                xs={12}
                sm={6}
                md={7}
                display="flex"
                justifyContent={'center'}
            >
                <DisplayMediaType
                    media={media}
                    maxWidth={'50%'}
                    maxHeight={200}
                    sx={{ objectFit: 'contain' }}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={5} sx={{ borderLeft: '1px solid #D3D3D3' }}>
                <MediaDataForm media={media} handleSubmit={handleSubmit} />
            </Grid>
        </Grid>
    );
};
