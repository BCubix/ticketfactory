import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';
import { REDIRECTION_TYPES } from '../../../../Constant';
import { CmtSimpleSelectFilters } from '../../../../Components/CmtFilters/CmtSimpleSelectFilter';
import CategoryIcon from '@mui/icons-material/Category';

export const RedirectionsFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Activé ?"
                icon={<CheckIcon />}
            />

            <CmtSimpleSelectFilters
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
                list={REDIRECTION_TYPES}
            />

            <CmtSearchFilters
                value={filters.redirectFrom}
                setValue={(newValue) => changeFilters({ ...filters, redirectFrom: newValue })}
                title="Chercher par source de la redirection"
                label="Redirigé depuis"
                icon={<TitleIcon />}
            />

            <CmtSearchFilters
                value={filters.redirectTo}
                setValue={(newValue) => changeFilters({ ...filters, redirectTo: newValue })}
                title="Chercher par destination de la redirection"
                label="Redirigé vers"
                icon={<TitleIcon />}
            />
        </Box>
    );
};
