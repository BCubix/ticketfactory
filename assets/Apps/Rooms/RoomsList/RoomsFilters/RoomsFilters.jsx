import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';

export const RoomsFilters = ({ filters, changeFilters }) => {
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
                value={filters.name}
                setValue={(newValue) => changeFilters({ ...filters, name: newValue })}
                title="Chercher par nom"
                label="Nom"
                icon={<TitleIcon />}
            />
        </Box>
    );
};
