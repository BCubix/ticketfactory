import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ImageFormatGenerate = () => {
    const dispatch = useDispatch();
    const [imageFormats, setImageFormats] = useState(null);
    const [mediasTotal, setMediasTotal] = useState(null);
    const [percentage, setPercentage] = useState(0);
    const [percentageDialog, setPercentageDialog] = useState(false);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.imageFormatsApi.getImageFormats({ page: 0 });
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            setImageFormats(result.imageFormats);
        });

        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMedias();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            setMediasTotal(result.total);
        });
    }, []);

    const handleSubmit = async (values) => {
        const nbRequest = parseInt(mediasTotal / 10) + (mediasTotal % 10 > 0);
        const percentageByRequest = 100 / nbRequest;

        setPercentageDialog(true);

        // Multiple request
        let success = true;
        for (let i = 0; i < nbRequest; ++i) {
            await apiMiddleware(dispatch, async () => {
                const result = await Api.imageFormatsApi.generateImageFormat(values, i);
                success = success && result.result;
                setPercentage((percentage) => percentage + percentageByRequest);
            });
        }

        // Add small sleep for get last show up 100% in progress
        await new Promise((r) => setTimeout(r, 1000));

        setPercentageDialog(false);
        setPercentage(0);

        if (!success) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
        } else {
            NotificationManager.success('Les médias ont bien été généré.', 'Succès', Constant.REDIRECTION_TIME);
        }
    };

    if (null === imageFormats || null === mediasTotal) {
        return <></>;
    }

    return (
        <>
            <Component.ImageFormatGenerateForm imageFormats={imageFormats} handleSubmit={handleSubmit} />
            <Dialog fullWidth open={percentageDialog} sx={{ display: 'flex', justifyContent: 'center' }}>
                <DialogTitle sx={{ fontSize: 17 }}>Génération des formats</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={percentage} />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};
