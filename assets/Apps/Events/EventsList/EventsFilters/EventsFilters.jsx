import { Box } from '@mui/system';
import React from 'react';
import { CmtSearchFilters } from '../../../../Components/CmtFilters/CmtSearchFilters';
import CheckIcon from '@mui/icons-material/Check';
import { CmtBooleanFilters } from '../../../../Components/CmtFilters/CmtBooleanFilters';
import TitleIcon from '@mui/icons-material/Title';
import { CmtMultipleSelectFilters } from '../../../../Components/CmtFilters/CmtMultipleSelectFilters';
import CategoryIcon from '@mui/icons-material/Category';
import roomsApi from '../../../../services/api/roomsApi';
import seasonsApi from '../../../../services/api/seasonsApi';
import tagsApi from '../../../../services/api/tagsApi';
import { CmtCategoriesFilters } from '../../../../Components/CmtFilters/CmtCategoriesFilters';

export const EventsFilters = ({ filters, changeFilters, categoriesList }) => {
    const handleGetRooms = async () => {
        const result = await roomsApi.getAllRooms();

        if (result?.result) {
            return result?.rooms;
        }

        return [];
    };

    const handleGetSeasons = async () => {
        const result = await seasonsApi.getAllSeasons();

        if (result?.result) {
            return result?.seasons;
        }

        return [];
    };

    const handleGetTags = async () => {
        const result = await tagsApi.getAllTags();

        if (result?.result) {
            return result?.tags;
        }

        return [];
    };

    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status de gestion"
                label="Gérée ?"
                id="activeFilter"
                icon={<CheckIcon />}
            />

            <CmtSearchFilters
                value={filters.name}
                setValue={(newValue) => changeFilters({ ...filters, name: newValue })}
                title="Chercher par nom"
                label="Nom"
                id="nameFilter"
                icon={<TitleIcon />}
            />

            <CmtCategoriesFilters
                list={categoriesList}
                value={filters.category}
                setValue={(newValue) => {
                    changeFilters({ ...filters, category: newValue });
                }}
                title="Chercher par catégories"
                label="Catégories"
                id="categoryFilter"
                icon={<CategoryIcon />}
            />

            <CmtMultipleSelectFilters
                value={filters.room}
                setValue={(newValue) => {
                    changeFilters({ ...filters, room: newValue });
                }}
                title="Chercher par salle"
                label="Salles"
                id="roomFilter"
                icon={<CategoryIcon />}
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                getList={handleGetRooms}
            />

            <CmtMultipleSelectFilters
                value={filters.season}
                setValue={(newValue) => {
                    changeFilters({ ...filters, season: newValue });
                }}
                title="Chercher par saison"
                label="Saisons"
                icon={<CategoryIcon />}
                id="seasonFilter"
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                getList={handleGetSeasons}
            />

            <CmtMultipleSelectFilters
                value={filters.tags}
                setValue={(newValue) => {
                    changeFilters({ ...filters, tags: newValue });
                }}
                title="Chercher par tags"
                label="Tags"
                icon={<CategoryIcon />}
                id="tagFilter"
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                getList={handleGetTags}
            />
        </Box>
    );
};
