import React from 'react';
import moment from 'moment';

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const DisplayMediaAddInformations = ({ onClose, selectedMedia, values, setFieldValue, name }) => {
    const isSelected = values.eventMedias?.map((el) => el.id).includes(selectedMedia?.id);

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

            <Component.DisplayMediaInformations selectedMedia={selectedMedia} />

            <Button
                variant={isSelected ? 'outlined' : 'contained'}
                color={isSelected ? 'error' : 'primary'}
                id="addRemoveFileMediaEvent"
                onClick={() => {
                    let newValue = values.eventMedias;

                    if (newValue.map((el) => el.id).includes(selectedMedia?.id)) {
                        newValue = newValue.filter((el) => el.id !== selectedMedia?.id);
                    } else {
                        newValue.push({ id: selectedMedia?.id, mainImg: false, position: '' });
                    }

                    setFieldValue(name, newValue);
                }}
            >
                {isSelected ? 'Retirer' : 'Ajouter'} le fichier
            </Button>
        </Box>
    );
};

export const DisplayMediaInformations = ({ selectedMedia }) => {
    return (
        <Box sx={{ paddingTop: 10 }}>
            <Box>
                <Typography component="span" variant="body2">
                    Crée le :
                </Typography>
                <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                    {moment(selectedMedia?.createdAt).format('DD-MM-YYYY')}
                </Typography>
            </Box>

            {selectedMedia?.updatedAt && (
                <Box>
                    <Typography component="span" variant="body2">
                        Mis à jour le :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {moment(selectedMedia?.updatedAt).format('DD-MM-YYYY')}
                    </Typography>
                </Box>
            )}

            <Box>
                <Typography component="span" variant="body2">
                    Type de fichier :
                </Typography>
                <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                    {selectedMedia?.documentType}
                </Typography>
            </Box>

            <Box>
                <Typography component="span" variant="body2">
                    Nom du fichier :
                </Typography>
                <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                    {selectedMedia?.documentFileName}
                </Typography>
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Box>
                    <Typography component="span" variant="body2">
                        Titre :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.title}
                    </Typography>
                </Box>

                {selectedMedia?.description && (
                    <Box>
                        <Typography component="span" variant="body2">
                            Description :
                        </Typography>
                        <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                            {selectedMedia?.description}
                        </Typography>
                    </Box>
                )}

                {selectedMedia?.legend && (
                    <Box>
                        <Typography component="span" variant="body2">
                            Légende :
                        </Typography>
                        <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                            {selectedMedia?.legend}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box display="flex" justifyContent={'center'}>
                <Box my={10} maxWidth={'100%'} maxHeight={'300px'} display="flex" justifyContent="center" position={'relative'}>
                    <Component.CmtDisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                </Box>
            </Box>
        </Box>
    );
};
