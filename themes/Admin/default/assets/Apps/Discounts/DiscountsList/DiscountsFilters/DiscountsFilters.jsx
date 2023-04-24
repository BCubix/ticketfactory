import React from 'react';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

import CheckIcon from '@mui/icons-material/Check';

export const DiscountsFilters = ({ filters, changeFilters }) => {
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
        </Box>
    );
};
