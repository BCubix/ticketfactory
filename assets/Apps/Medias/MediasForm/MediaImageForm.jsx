import { Box } from '@mui/system';
import React, { useEffect, useRef } from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from 'tui-image-editor';
import { Button } from '@mui/material';
import mediasApi from '../../../services/api/mediasApi';
import { REDIRECTION_TIME } from '../../../Constant';
import { NotificationManager } from 'react-notifications';

export const MediaImageForm = ({ media = null, closeImageEditor, editSuccess }) => {
    const editor = useRef(null);

    const handleValidateImage = async () => {
        const fileBase64 = editor.current.toDataURL();

        const result = await mediasApi.updateImage(media.id, fileBase64, media.title);

        if (result?.result && result?.media?.success) {
            NotificationManager.success(
                'Votre image a bien été mise à jour.',
                'Succès',
                REDIRECTION_TIME
            );

            editSuccess();
        }
    };

    useEffect(() => {
        editor.current = new ImageEditor('#imageEditor', {
            includeUI: {
                loadImage: {
                    path: media.documentUrl,
                    name: media.title,
                },
                menu: ['crop', 'flip', 'rotate', 'resize'],
                uiSize: {
                    width: '100%',
                    height: '500px',
                },
                menuBarPosition: 'bottom',
            },
            cssMaxHeight: 800,
            cssMaxWidth: 500,
            cssMinHeight: 500,
            selectionStyle: {
                cornerSize: 20,
                rotatingPointOffset: 70,
            },
        });
    }, []);

    return (
        <>
            <Box id={'imageEditor'} />
            <Box display="flex" justifyContent={'flex-end'} width="100%" sx={{ my: 5 }}>
                <Button variant="outlined" color="secondary" onClick={closeImageEditor}>
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    sx={{ ml: 3 }}
                    color="primary"
                    onClick={handleValidateImage}
                >
                    Valider
                </Button>
            </Box>
        </>
    );
};
