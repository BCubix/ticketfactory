import React from 'react';

import CategoryIcon from '@mui/icons-material/Category';
import CheckIcon from '@mui/icons-material/Check';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const RedirectionsFilters = ({ filters, changeFilters }) => {
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

            <Component.CmtSimpleSelectFilters
                value={filters.redirectType}
                setValue={(newValue) => {
                    changeFilters({ ...filters, redirectType: newValue });
                }}
                title="Chercher par type de redirection"
                label="Type de redirection"
                icon={<CategoryIcon />}
                parameters={{
                    nameValue: 'value',
                    nameLabel: 'label',
                }}
                list={Constant.REDIRECTION_TYPES}
                id="redirectionTypeFilter"
            />

            <Component.CmtSearchFilters
                value={filters.redirectFrom}
                setValue={(newValue) => changeFilters({ ...filters, redirectFrom: newValue })}
                title="Chercher par source de la redirection"
                label="Redirigé depuis"
                icon={<TextFieldsIcon />}
                id="redirectFromFilter"
            />

            <Component.CmtSearchFilters
                value={filters.redirectTo}
                setValue={(newValue) => changeFilters({ ...filters, redirectTo: newValue })}
                title="Chercher par destination de la redirection"
                label="Redirigé vers"
                icon={<TextFieldsIcon />}
                id="redirectToFilter"
            />
        </Box>
    );
};
