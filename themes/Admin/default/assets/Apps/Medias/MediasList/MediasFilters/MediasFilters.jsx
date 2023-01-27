import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

const LIST_TYPE = [
    { label: 'Image', value: 'image' },
    { label: 'Audio', value: 'audio' },
    { label: 'Vidéo', value: 'video' },
    { label: 'Word', value: 'word' },
    { label: 'Excel', value: 'excel' },
    { label: 'Powerpoint', value: 'powerpoint' },
    { label: 'Pdf', value: 'pdf' },
    { label: 'Text', value: 'text' },
];

const SORT_LIST = [
    { label: 'ID', value: 'id' },
    { label: 'Activé', value: 'active' },
    { label: 'Titre', value: 'title' },
    { label: 'Type', value: 'documentType' },
    { label: 'Poids', value: 'documentSize' },
];

export const MediasFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Actif ?"
                icon={<CheckIcon />}
                id="activeFilter"
            />

            <Component.CmtSearchFilters
                value={filters.title}
                setValue={(newValue) => changeFilters({ ...filters, title: newValue })}
                title="Chercher par titre"
                label="Titre"
                icon={<TextFieldsIcon />}
                id="titleFilter"
            />

            <Component.MediasSorters
                value={filters.sort}
                setValue={(newValue) => {
                    changeFilters({ ...filters, sort: newValue });
                }}
                list={SORT_LIST}
            />
        </Box>
    );
};
