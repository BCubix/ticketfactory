import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';
import { CmtMultipleSelectFilters } from '../../../../Components/CmtFilters/CmtMultipleSelectFilters';
import CategoryIcon from '@mui/icons-material/Category';

export const ContentsFilters = ({ filters, changeFilters, list }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status de gestion"
                label="Gérée ?"
                icon={<CheckIcon />}
                id="activeFilter"
            />

            <CmtSearchFilters
                value={filters.title}
                setValue={(newValue) => changeFilters({ ...filters, title: newValue })}
                title="Chercher par titre"
                label="Titre"
                icon={<TitleIcon />}
                id="titleFilter"
            />

            <CmtMultipleSelectFilters
                list={list}
                value={filters.contentType}
                setValue={(newValue) => {
                    changeFilters({ ...filters, contentType: newValue });
                }}
                title="Chercher par type de contenu"
                label="Type de contenu"
                icon={<CategoryIcon />}
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                id="contentTypeFilter"
            />
        </Box>
    );
};
