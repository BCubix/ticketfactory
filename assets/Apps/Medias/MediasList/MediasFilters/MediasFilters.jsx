import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';
import { CmtMultipleSelectFilters } from '../../../../Components/CmtFilters/CmtMultipleSelectFilters';
import CategoryIcon from '@mui/icons-material/Category';
import { MediasSorters } from './MediasSorters';

const LIST_TYPE = [
    { label: 'Image', value: 'image' },
    { label: 'Audio', value: 'audio' },
    { label: 'Vidéo', value: 'video' },
    { label: 'Word', value: 'word' },
    { label: 'Excel', value: 'excel' },
    { label: 'Powerpoint', value: 'powerpoint' },
    { label: 'Pdf', value: 'pdf' },
    { label: 'Text', value: 'text' },
];

const SORT_LIST = [
    { label: 'ID', value: 'id' },
    { label: 'Activé', value: 'active' },
    { label: 'Titre', value: 'title' },
    { label: 'Type', value: 'documentType' },
    { label: 'Poids', value: 'documentSize' },
];

export const MediasFilters = ({ filters, changeFilters }) => {
    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Activé ?"
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
                value={filters.documentType}
                setValue={(newValue) => {
                    changeFilters({ ...filters, documentType: newValue });
                }}
                title="Chercher par type"
                label="Type"
                icon={<CategoryIcon />}
                parameters={{
                    nameValue: 'value',
                    nameLabel: 'label',
                }}
                list={LIST_TYPE}
                id="mediaDocumentTypeFilter"
            />

            <MediasSorters
                value={filters.sort}
                setValue={(newValue) => {
                    changeFilters({ ...filters, sort: newValue });
                }}
                list={SORT_LIST}
            />
        </Box>
    );
};
