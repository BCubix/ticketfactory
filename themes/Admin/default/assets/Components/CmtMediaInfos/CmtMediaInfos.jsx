import React from 'react';
import moment from 'moment/moment';

import { Button, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import CloseIcon from '@mui/icons-material/Close';

import { Component } from '@/AdminService/Component';

export const CmtMediaInfos = ({ onClose, selectedMedia, isSelected, onClick }) => {
    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" px={10}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <Box sx={{ marginTop: 3 }}>
                <Component.CmtDisplayMediaInfos selectedMedia={selectedMedia} displayImage={true} displayMeta={true} />
            </Box>

            <Button
                variant={isSelected ? 'outlined' : 'contained'}
                color={isSelected ? 'error' : 'primary'}
                id="addRemoveFileMediaEvent"
                onClick={() => {
                    onClick(el);
                }}
            >
                {isSelected ? 'Retirer' : 'Ajouter'} le fichier
            </Button>
        </Box>
    );
};

export const CmtDisplayMediaInfos = ({ selectedMedia, displayImage = false, displayMeta = false }) => {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Titre :
                </Typography>
                <Typography variant="body1">{selectedMedia?.title}</Typography>
            </Box>

            {selectedMedia?.realType === 'image' && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography fontSize={10} variant="body2">
                        Texte alternatif :
                    </Typography>
                    <Typography variant="body1">{selectedMedia?.alt}</Typography>
                </Box>
            )}

            <Box sx={{ marginTop: 3 }}>
                <Typography fontSize={10} component="span" variant="body2">
                    Légende :
                </Typography>
                <Typography component="span" variant="body1">
                    {selectedMedia?.legend}
                </Typography>
            </Box>

            {displayImage && (
                <Box display="flex" justifyContent={'center'}>
                    <Box my={10} maxWidth={'100%'} maxHeight={'300px'} display="flex" justifyContent="center" position={'relative'}>
                        <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                    </Box>
                </Box>
            )}

            {displayMeta && <Component.CmtDisplayMediaMeta selectedMedia={selectedMedia} />}
        </Box>
    );
};

export const CmtDisplayMediaMeta = ({ selectedMedia }) => {
    return (
        <Grid container spacing={4} sx={{ my: 3 }}>
            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Crée le :
                </Typography>
                <Typography variant="body1">{moment(selectedMedia?.createdAt).format('DD-MM-YYYY')}</Typography>
            </Grid>

            {selectedMedia?.updatedAt && (
                <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                    <Typography fontSize={10} variant="body2">
                        Mis à jour le :
                    </Typography>
                    <Typography variant="body1">{moment(selectedMedia?.updatedAt).format('DD-MM-YYYY')}</Typography>
                </Grid>
            )}

            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Type de fichier :
                </Typography>
                <Typography variant="body1">{selectedMedia?.documentType}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 3 }}>
                <Typography fontSize={10} variant="body2">
                    Nom du fichier :
                </Typography>
                <Typography variant="body1">{selectedMedia?.documentFileName}</Typography>
            </Grid>
        </Grid>
    );
};
