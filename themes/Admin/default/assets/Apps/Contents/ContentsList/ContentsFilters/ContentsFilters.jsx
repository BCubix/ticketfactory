import React from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import CheckIcon from '@mui/icons-material/Check';
import TitleIcon from '@mui/icons-material/Title';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const ContentsFilters = ({ filters, changeFilters, list }) => {
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
                icon={<TitleIcon />}
                id="titleFilter"
            />

            <Component.CmtMultipleSelectFilters
                list={list}
                value={filters.contentType}
                setValue={(newValue) => {
                    changeFilters({ ...filters, contentType: newValue });
                }}
                title="Chercher par type de contenu"
                label="Type de contenu"
                icon={<CategoryIcon />}
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                id="contentTypeFilter"
            />
        </Box>
    );
};
