import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { REDIRECTION_TIME } from '../../../Constant';
import { getMediasAction, mediasSelector } from '../../../redux/medias/mediasSlice';
import { DisplayMediaType } from '../Components/DisplayMediaType';
import { MediaElement } from '../Components/sc.MediaElement';
import { CreateMedia } from '../CreateMedia/CreateMedia';
import { EditMedia } from '../EditMedia/EditMedia';

export const MediasList = () => {
    const { loading, medias, error } = useSelector(mediasSelector);
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(null);

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

    return (
        <CmtPageWrapper title="Médias">
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%' }}>
                    <Box display="flex" justifyContent={'space-between'}>
                        <Typography component="h2" variant="h3">
                            Salles ({medias?.length})
                        </Typography>
                        <Button variant="contained" onClick={() => setCreateDialog(true)}>
                            Nouveau
                        </Button>
                    </Box>
                    <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                        {medias?.map((item, index) => (
                            <MediaElement key={index} onClick={() => setEditDialog(item.id)}>
                                <DisplayMediaType media={item} width={'100%'} height={'auto'} />
                            </MediaElement>
                        ))}
                    </Box>
                </CardContent>
            </Card>
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
                    />
                </DialogContent>
            </Dialog>
        </CmtPageWrapper>
    );
};
