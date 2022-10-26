import { CardContent, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CmtDisplayMediaType } from '../../../Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { CmtMediaElement } from '../../../Components/CmtMediaElement/sc.MediaElement';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtPagination } from '../../../Components/CmtPagination/CmtPagination';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { REDIRECTION_TIME } from '../../../Constant';
import {
    changeMediasFilters,
    getMediasAction,
    mediasSelector,
} from '../../../redux/medias/mediasSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import mediasApi from '../../../services/api/mediasApi';
import { CreateMedia } from '../CreateMedia/CreateMedia';
import { EditMedia } from '../EditMedia/EditMedia';
import { MediasFilters } from './MediasFilters/MediasFilters';

export const MediasList = () => {
    const { loading, medias, filters, total, error } = useSelector(mediasSelector);
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !medias && !error) {
            dispatch(getMediasAction());
        }
    }, []);

    const handleSubmit = () => {
        setCreateDialog(false);
        dispatch(getMediasAction());
        NotificationManager.success('Votre élément à bien été ajouté.', 'Succès', REDIRECTION_TIME);
    };

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await mediasApi.deleteMedia(id);

        dispatch(getMediasAction());

        setDeleteDialog(null);
        setEditDialog(null);
    };

    return (
        <CmtPageWrapper title="Médias">
            <CmtCard sx={{ height: '100%', mt: 5 }}>
                <CardContent sx={{ height: '100%' }}>
                    <Box display="flex" justifyContent={'space-between'}>
                        <Typography component="h2" variant="h5" fontSize={20}>
                            Liste des médias{' '}
                            {medias &&
                                `(${(filters.page - 1) * filters.limit + 1} - ${
                                    (filters.page - 1) * filters.limit + medias.length
                                } sur ${total})`}
                        </Typography>
                        <CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                            Nouveau
                        </CreateButton>
                    </Box>

                    <MediasFilters
                        filters={filters}
                        changeFilters={(values) => dispatch(changeMediasFilters(values))}
                    />

                    <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                        {medias?.map((item, index) => (
                            <CmtMediaElement key={index} onClick={() => setEditDialog(item.id)}>
                                <CmtDisplayMediaType media={item} width={'100%'} height={'auto'} />
                            </CmtMediaElement>
                        ))}
                    </Box>

                    <CmtPagination
                        page={filters.page}
                        total={total}
                        limit={filters.limit}
                        setPage={(newValue) =>
                            dispatch(changeMediasFilters({ ...filters }, newValue))
                        }
                        setLimit={(newValue) => {
                            dispatch(changeMediasFilters({ ...filters, limit: newValue }));
                        }}
                        length={medias?.length}
                    />
                </CardContent>
            </CmtCard>
            <Dialog
                fullWidth
                maxWidth="md"
                open={createDialog}
                onClose={() => setCreateDialog(false)}
            >
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un fichier</DialogTitle>
                <DialogContent>
                    <CreateMedia handleSubmit={handleSubmit} />
                </DialogContent>
            </Dialog>

            <Dialog
                fullWidth
                maxWidth="lg"
                open={Boolean(editDialog)}
                onClose={() => setEditDialog(false)}
            >
                <DialogTitle sx={{ fontSize: 20 }}>Modifier un fichier</DialogTitle>
                <DialogContent dividers>
                    <EditMedia
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

            <DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer cet élément ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </CmtPageWrapper>
    );
};
