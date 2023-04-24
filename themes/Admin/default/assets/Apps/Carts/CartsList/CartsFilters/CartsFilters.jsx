import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const CartsFilters = ({ filters, changeFilters }) => {
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
