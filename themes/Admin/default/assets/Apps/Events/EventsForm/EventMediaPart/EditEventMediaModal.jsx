import React from 'react';

import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const EditEventMediaModal = ({ open, closeModal, selectedMedia, values, setFieldValue, name }) => {
    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={closeModal}>
            <DialogTitle sx={{ fontSize: 20 }}>Détails de l'élément média</DialogTitle>
            {open && (
                <DialogContent dividers>
                    <Grid container spacing={4} sx={{ mb: -4, minHeight: 300 }}>
                        <Grid item sx={{ mt: 4, mb: 4 }} xs={12} sm={6} md={7} display="flex" flexDirection={'column'} alignItems={'center'}>
                            <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'50%'} maxHeight={200} sx={{ objectFit: 'contain' }} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={5} sx={{ borderLeft: '1px solid #D3D3D3' }}>
                            <Component.DisplayMediaInformations selectedMedia={selectedMedia} />

                            <Box display="flex" my={5}>
                                <Button
                                    variant={'outlined'}
                                    color={'error'}
                                    onClick={() => {
                                        let newValue = values.eventMedias.filter((el) => el.id !== selectedMedia?.id);
                                        setFieldValue(name, newValue);
                                        closeModal();
                                    }}
                                >
                                    Retirer le fichier
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            )}
        </Dialog>
    );
};
