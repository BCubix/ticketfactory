import React from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

export const CmtMediaModalInfos = ({
    media,
    selectedMedia,
    setFieldValue,
    name,
    onClick,
    AddMediaLabel,
    RemoveMediaLabel,
    updatedMedia,
    imageFormatList,
    startUpdatingMedia = null,
    endUpdatingMedia = null,
}) => {
    const isSelected = Array.isArray(media) ? media?.includes(selectedMedia?.id) : media?.id === selectedMedia?.id;

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">Selectionnez un élément pour afficher ses détails</Typography>
            </Box>
        );
    }

    return (
        <Component.CmtDisplayMediaInfos
            selectedMedia={selectedMedia}
            displayImage
            displayMeta
            updatedMedia={updatedMedia}
            imageFormatList={imageFormatList}
            startUpdatingMedia={startUpdatingMedia}
            endUpdatingMedia={endUpdatingMedia}
            isSelected={isSelected}
            setFieldValue={setFieldValue}
            name={name}
            onClick={onClick}
            AddMediaLabel={AddMediaLabel}
            RemoveMediaLabel={RemoveMediaLabel}
            displaySelectButton={true}
        />
    );
};
