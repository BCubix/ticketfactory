import React from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

export const CmtMediaModalInfos = ({ media, selectedMedia, setFieldValue, name, onClick, AddMediaLabel, RemoveMediaLabel }) => {
    const isSelected = Array.isArray(media) ? media?.includes(selectedMedia?.id) : media?.id === selectedMedia?.id;

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" px={10}>
            <Component.CmtDisplayMediaInfos selectedMedia={selectedMedia} displayImage displayMeta />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant={isSelected ? 'outlined' : 'contained'}
                    color={isSelected ? 'error' : 'primary'}
                    id="add-remove-media"
                    onClick={() => {
                        if (null !== onClick) {
                            onClick(selectedMedia);
                        } else {
                            if (isSelected) {
                                setFieldValue(name, null);
                            } else {
                                setFieldValue(name, selectedMedia);
                            }
                        }
                    }}
                >
                    {isSelected ? RemoveMediaLabel : AddMediaLabel} le fichier
                </Button>
            </Box>
        </Box>
    );
};
