import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';

export const UserFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Activé ?"
                icon={<CheckIcon />}
            />

            <CmtSearchFilters
                value={filters.email}
                setValue={(newValue) => changeFilters({ ...filters, email: newValue })}
                title="Chercher par email"
                label="Email"
                icon={<TitleIcon />}
            />

            <CmtSearchFilters
                value={filters.firstName}
                setValue={(newValue) => changeFilters({ ...filters, firstName: newValue })}
                title="Chercher par prénom"
                label="Prénom"
                icon={<TitleIcon />}
            />

            <CmtSearchFilters
                value={filters.lastName}
                setValue={(newValue) => changeFilters({ ...filters, lastName: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<TitleIcon />}
            />

            <CmtSearchFilters
                value={filters.role}
                setValue={(newValue) => changeFilters({ ...filters, role: newValue })}
                title="Chercher par role"
                label="Role"
                icon={<TitleIcon />}
            />
        </Box>
    );
};
