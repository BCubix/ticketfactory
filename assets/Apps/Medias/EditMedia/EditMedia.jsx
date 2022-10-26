import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { REDIRECTION_TIME } from '../../../Constant';
import { getMediasAction } from '../../../redux/medias/mediasSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import mediasApi from '../../../services/api/mediasApi';
import { CmtDisplayMediaType } from '../../../Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { MediaDataForm } from '../MediasForm/MediaDataForm';
import { MediaImageForm } from '../MediasForm/MediaImageForm';
import { getMediaType } from '../../../services/utils/getMediaType';

export const EditMedia = ({ id, editSuccess, onCancel, deleteElement }) => {
    const dispatch = useDispatch();
    const [media, setMedia] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [mediaType, setMediaType] = useState(null);

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
        setMediaType(getMediaType(result?.media?.documentType));
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
                <MediaImageForm
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
                        <CmtDisplayMediaType
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
                        <MediaDataForm
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
