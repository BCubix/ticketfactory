import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

export const CmtMediaModalInfos = ({ media, selectedMedia, ...rest }) => {
    const isSelected = Array.isArray(media) ? media?.includes(selectedMedia?.id) : media?.id === selectedMedia?.id;

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return <Component.CmtDisplayMediaInfos selectedMedia={selectedMedia} isSelected={isSelected} displayImage displayMeta {...rest} />;
};
