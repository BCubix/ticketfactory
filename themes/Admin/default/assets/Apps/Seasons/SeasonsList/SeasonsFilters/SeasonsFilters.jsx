import React from 'react';

import { Box } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import TextFieldsIcon from '@mui/icons-material/TextFields';

import { Component } from "@/AdminService/Component";

export const SeasonsFilters = ({ filters, changeFilters }) => {
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
                value={filters.name}
                setValue={(newValue) => changeFilters({ ...filters, name: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<TextFieldsIcon />}
                id="nameFilter"
            />
        </Box>
    );
};
