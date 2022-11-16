import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import TitleIcon from '@mui/icons-material/Title';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const PagesFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Activé ?"
                icon={<CheckIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.title}
                setValue={(newValue) => changeFilters({ ...filters, title: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<TitleIcon />}
            />
        </Box>
    );
};
