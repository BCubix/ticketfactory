import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeMediasFilters, getMediasAction, mediasSelector } from '@Redux/medias/mediasSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const MediasList = () => {
    const { loading, medias, filters, total, error } = useSelector(mediasSelector);
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const [addIframeDialog, setAddIframeDialog] = useState(false);
    const [editIframeDialog, setEditIframeDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);

    useEffect(() => {
        if (!loading && !medias && !error) {
            dispatch(getMediasAction());
        }
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getMediasAction());
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
    };

    const handleAddIframe = (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.createIframeMedia(values);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            dispatch(getMediasAction());
            setAddIframeDialog(false);
            NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', Constant.REDIRECTION_TIME);
        });
    };

    const handleEditIframe = (id, values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.editIframeMedia(id, values);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            dispatch(getMediasAction());
            setEditIframeDialog(false);
            NotificationManager.success('Votre élément a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
        });
    };

    const handleDelete = async (id) => {
        apiMiddleware(dispatch, async () => {
            await Api.mediasApi.deleteMedia(id);
            dispatch(getMediasAction());

            setDeleteDialog(null);
            setEditDialog(null);
            setEditIframeDialog(null);
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }

            setMediaCategoriesList(result.mediaCategories);
        });
    }, []);

    return (
        <Component.CmtPageWrapper title="Médias">
            <Component.CmtCard sx={{ height: '100%', mt: 5 }}>
                <Component.CmtCardHeader
                    title={
                        <Box display="flex" justifyContent={'space-between'} alignItems="center">
                            <Typography component="h2" variant="h5" sx={{ color: (theme) => theme.palette.primary.dark }}>
                                Liste des médias {medias && `(${(filters.page - 1) * filters.limit + 1} - ${(filters.page - 1) * filters.limit + medias.length} sur ${total})`}
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Component.CreateButton variant="contained" onClick={() => setAddIframeDialog(true)} id="addIframeMediaButton" sx={{ marginRight: 3 }}>
                                    Ajouter un iframe
                                </Component.CreateButton>
                                <Component.CreateButton variant="contained" onClick={() => setCreateDialog(true)} id="createMediaButton">
                                    Nouveau
                                </Component.CreateButton>
                            </Box>
                        </Box>
                    }
                />
                <CardContent sx={{ height: '100%' }}>
                    <Component.MediasFilters filters={filters} changeFilters={(values) => dispatch(changeMediasFilters(values))} categoriesList={mediaCategoriesList} />

                    <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                        {medias?.map((item, index) => (
                            <Component.CmtMediaElement
                                id={`mediaItem-${item.id}`}
                                key={index}
                                onClick={() => {
                                    item.iframe ? setEditIframeDialog(item.id) : setEditDialog(item.id);
                                }}
                            >
                                <Component.CmtDisplayMediaType media={item} width={'100%'} height={'auto'} />
                            </Component.CmtMediaElement>
                        ))}
                    </Box>

                    <Component.CmtPagination
                        page={filters.page}
                        total={total}
                        limit={filters.limit}
                        setPage={(newValue) => dispatch(changeMediasFilters({ ...filters }, newValue))}
                        setLimit={(newValue) => {
                            dispatch(changeMediasFilters({ ...filters, limit: newValue }));
                        }}
                        length={medias?.length}
                    />
                </CardContent>
            </Component.CmtCard>

            <Dialog fullWidth maxWidth="md" open={createDialog} onClose={() => setCreateDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un fichier</DialogTitle>
                <DialogContent>
                    <Component.CreateMedia handleSubmit={handleSubmit} />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={addIframeDialog} onClose={() => setAddIframeDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un iframe</DialogTitle>
                <DialogContent>
                    <Component.IframeMediaForm
                        handleSubmit={handleAddIframe}
                        onCancel={() => {
                            setAddIframeDialog(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={Boolean(editIframeDialog)} onClose={() => setEditIframeDialog(null)}>
                <DialogTitle sx={{ fontSize: 20 }}>Modifier un iframe</DialogTitle>
                <DialogContent>
                    <Component.IframeMediaForm
                        id={editIframeDialog}
                        handleSubmit={(values) => handleEditIframe(editIframeDialog, values)}
                        onCancel={() => {
                            setEditIframeDialog(null);
                        }}
                        deleteElement={(id) => setDeleteDialog(id)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog fullWidth maxWidth="lg" open={Boolean(editDialog)} onClose={() => setEditDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Modifier un fichier</DialogTitle>
                <DialogContent dividers>
                    <Component.EditMedia
                        id={editDialog}
                        onCancel={() => {
                            setEditDialog(null);
                        }}
                        editSuccess={() => {
                            setEditDialog(null);
                        }}
                        deleteElement={(id) => setDeleteDialog(id)}
                    />
                </DialogContent>
            </Dialog>

            <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de vouloir supprimer cet élément ?</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </Component.CmtPageWrapper>
    );
};
