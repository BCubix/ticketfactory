import React from 'react';

import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const PageBlocksFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtSearchFilters
                value={filters.name}
                setValue={(newValue) => changeFilters({ ...filters, title: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<TextFieldsIcon />}
                id="titleFilter"
            />
        </Box>
    );
};
