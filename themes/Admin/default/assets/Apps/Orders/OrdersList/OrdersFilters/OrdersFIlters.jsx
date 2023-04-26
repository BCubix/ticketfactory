import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const OrdersFilters = ({ filters }) => {
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
