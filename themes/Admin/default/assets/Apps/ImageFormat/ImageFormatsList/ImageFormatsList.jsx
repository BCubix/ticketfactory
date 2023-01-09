import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { TableColumn } from "@/AdminService/TableColumn";

import {
    changeImageFormatsFilters,
    getImageFormatsAction,
    imageFormatsSelector,
} from '@Redux/imageFormats/imageFormatSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const ImageFormatsList = () => {
    const { loading, imageFormats, filters, total, error } = useSelector(imageFormatsSelector);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [percentageDialog, setPercentageDialog] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [medias, setMedias] = useState([]);

    useEffect(() => {
        if (!loading && !imageFormats && !error) {
            dispatch(getImageFormatsAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMedias({ page: 0 });
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

                return;
            }

            setMedias(result.medias);
        });
    }, []);

    const handleDelete = async (id) => {
        await Api.imageFormatsApi.deleteImageFormat(id);

        dispatch(getImageFormatsAction());

        setDeleteDialog(null);
    };

    const handleSubmitGenerate = async (values) => {
        const mediaLength = medias.length;

        const nbRequest = parseInt(mediaLength / 10) + (mediaLength % 10 > 0);
        const percentageByRequest = 100 / nbRequest;

        setPercentageDialog(true);

        let success = true;
        for (let i = 0; i < nbRequest; ++i) {
            await apiMiddleware(dispatch, async () => {
                const result = await Api.imageFormatsApi.generateImageFormat(values, i);
                success = success && result.result;
                setPercentage((percentage) => percentage + percentageByRequest);
            });
        }

        await new Promise(r => setTimeout(r, 1000));
        setPercentageDialog(false);
        setPercentage(0);

        if (!success) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
        } else {
            NotificationManager.success(
                'Les médias ont bien été généré.',
                'Succès',
                Constant.REDIRECTION_TIME
            );
        }
    };

    return (
        <>
            <Component.CmtPageWrapper title="Formats D'image">
                <Component.CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des formats d'image{' '}
                                {imageFormats &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + imageFormats.length
                                    } sur ${total})`}
                            </Typography>
                            <Component.CreateButton
                                variant="contained"
                                onClick={() => navigate(Constant.IMAGE_FORMATS_BASE_PATH + Constant.CREATE_PATH)}
                            >
                                Nouveau
                            </Component.CreateButton>
                        </Box>

                        <Component.ImageFormatsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeImageFormatsFilters(values))}
                        />

                        <Component.ListTable
                            table={TableColumn.ImageFormatsList}
                            list={imageFormats}
                            onEdit={(id) => {
                                navigate(`${Constant.IMAGE_FORMATS_BASE_PATH}/${id}${Constant.EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) =>
                                dispatch(changeImageFormatsFilters(newFilters))
                            }
                        />

                        <Component.CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeImageFormatsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(
                                    changeImageFormatsFilters({ ...filters, limit: newValue })
                                );
                            }}
                            length={imageFormats?.length}
                        />
                    </CardContent>
                </Component.CmtCard>

                <Component.ImageFormatParameters />

                <Component.ImageFormatGenerateForm
                    imageFormats={imageFormats}
                    handleSubmit={handleSubmitGenerate}
                />
            </Component.CmtPageWrapper>
            <Dialog
                fullWidth
                open={percentageDialog}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <DialogTitle sx={{ fontSize: 17 }}>Génération des formats</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={percentage} />
                    </Box>
                </DialogContent>
            </Dialog>
            <Component.DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer ce format d'image ?
                    </Typography>
                    <Typography component="p">
                        Les miniatures seront supprimées.
                    </Typography>
                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
