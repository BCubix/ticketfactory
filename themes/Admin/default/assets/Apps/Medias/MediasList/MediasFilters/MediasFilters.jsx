import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

const LIST_TYPE = [
    { label: 'Image', value: 'Image' },
    { label: 'Audio', value: 'Audio' },
    { label: 'Vidéo', value: 'Vidéo' },
    { label: 'Word', value: 'Word' },
    { label: 'Excel', value: 'Excel' },
    { label: 'Powerpoint', value: 'Powerpoint' },
    { label: 'Pdf', value: 'PDF' },
    { label: 'Text', value: 'Text' },
];

const SORT_LIST = [
    { label: 'ID', value: 'id' },
    { label: 'Activé', value: 'active' },
    { label: 'Titre', value: 'title' },
    { label: 'Type', value: 'documentType' },
    { label: 'Poids', value: 'documentSize' },
];

export const MediasFilters = ({ filters, changeFilters, categoriesList }) => {
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

            <Component.CmtBooleanFilters
                value={filters.iframe}
                setValue={(newValue) => changeFilters({ ...filters, iframe: newValue })}
                title="Chercher les iframes"
                label="Iframes ?"
                icon={<CheckIcon />}
                id="iframeFilter"
            />

            <Component.CmtSearchFilters
                value={filters.title}
                setValue={(newValue) => changeFilters({ ...filters, title: newValue })}
                title="Chercher par titre"
                label="Titre"
                icon={<TextFieldsIcon />}
                id="titleFilter"
            />

            <Component.CmtMultipleSelectFilters
                list={LIST_TYPE}
                value={filters.type}
                setValue={(newValue) => changeFilters({ ...filters, type: newValue })}
                title="Chercher par type"
                label="Type"
                icon={<TextFieldsIcon />}
                id="typeFilter"
                parameters={{
                    nameValue: 'value',
                    nameLabel: 'label',
                }}
            />

            {categoriesList && (
                <Component.CmtCategoriesFilters
                    value={filters.category}
                    list={categoriesList}
                    setValue={(newValue) => changeFilters({ ...filters, category: newValue })}
                    title="Chercher par catégorie"
                    label="Catégories"
                    icon={<TextFieldsIcon />}
                    id="categoryFilter"
                />
            )}

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
