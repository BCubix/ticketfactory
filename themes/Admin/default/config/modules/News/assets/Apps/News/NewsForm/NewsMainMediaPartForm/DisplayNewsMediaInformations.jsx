import React from 'react';
import moment from 'moment';

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const DisplayNewsMediaInformations = ({
    onClose,
    selectedMedia,
    values,
    setFieldValue,
    name,
}) => {
    const isSelected = values[name]?.id === selectedMedia?.id;

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">
                    Selectionnez une image pour afficher ses détails
                </Typography>
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

                <Box>
                    <Typography component="span" variant="body2">
                        Titre :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.title}
                    </Typography>
                </Box>

                <Box my={10} display="flex" justifyContent={'center'}>
                    <Box
                        maxWidth={'100%'}
                        maxHeight={'300px'}
                        display="flex"
                        justifyContent="center"
                    >
                        <Component.CmtDisplayMediaType
                            media={selectedMedia}
                            maxWidth={'100%'}
                            maxHeight={'300px'}
                        />
                    </Box>
                </Box>

                {selectedMedia?.description && (
                    <Box>
                        <Typography variant="body2">Description :</Typography>
                        <Typography variant="body1" sx={{ marginLeft: 3 }}>
                            {selectedMedia?.description}
                        </Typography>
                    </Box>
                )}

                {selectedMedia?.legend && (
                    <Box>
                        <Typography variant="body2">Légende :</Typography>
                        <Typography variant="body1" sx={{ marginLeft: 3 }}>
                            {selectedMedia?.legend}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Button
                variant={isSelected ? 'outlined' : 'contained'}
                color={isSelected ? 'error' : 'primary'}
                onClick={() => {
                    if (isSelected) {
                        setFieldValue(name, null);
                        return;
                    }

                    setFieldValue(name, selectedMedia);
                }}
            >
                {isSelected ? 'Retirer' : 'Sélectionner'} l'image
            </Button>
        </Box>
    );
};
