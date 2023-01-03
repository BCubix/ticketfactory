import React, { useEffect, useState } from 'react';

import { NotificationManager } from 'react-notifications';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AddEventMediaModal = ({ open, closeModal, mediaList, values, name, setFieldValue, onAddNewMedia }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const addedElements = values.eventMedias?.map((el) => el.id) || [];

    useEffect(() => {
        setSelectedMedia(null);
    }, [open]);

    const handleSubmit = () => {
        setCreateDialog(false);
        onAddNewMedia();
        NotificationManager.success('Votre élément a bien été ajouté.', 'Succès', REDIRECTION_TIME);
    };

    return (
        <Dialog open={open} onClose={closeModal} fullScreen TransitionComponent={Transition}>
            <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                <Box display={'flex'} justifyContent="space-between">
                    <Typography component="h1" variant="h5" fontSize={20}>
                        Ajouter des éléments média à l'évènement
                    </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={closeModal}
                        id="closeAddEventMediaModal"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <Box height="100%" width={'100%'} sx={{ padding: 0 }}>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12} md={9} px={5} py={5}>
                        <Component.CreateButton variant="contained" sx={{ marginLeft: 2 }} onClick={() => setCreateDialog(true)}>
                            Créer un nouveau média
                        </Component.CreateButton>
                        <Box display="flex" pt={5} flexWrap="wrap">
                            {mediaList?.map((item, index) => (
                                <Component.CmtMediaElement
                                    key={index}
                                    onClick={() => setSelectedMedia(item)}
                                    id={`mediaEventAddElementValue-${item.id}`}
                                    sx={{
                                        border: (theme) => (addedElements.includes(item.id) ? `1px solid ${theme.palette.primary.main}` : ''),
                                    }}
                                >
                                    <Component.CmtDisplayMediaType media={item} width={'100%'} />
                                </Component.CmtMediaElement>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}>
                        <Component.DisplayMediaAddInformations
                            onClose={() => setSelectedMedia(null)}
                            selectedMedia={selectedMedia}
                            values={values}
                            setFieldValue={setFieldValue}
                            name={name}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Dialog fullWidth maxWidth="md" open={createDialog} onClose={() => setCreateDialog(false)}>
                <DialogTitle sx={{ fontSize: 20 }}>Ajouter un fichier</DialogTitle>
                <DialogContent>
                    <Component.CreateMedia handleSubmit={handleSubmit} />
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};
