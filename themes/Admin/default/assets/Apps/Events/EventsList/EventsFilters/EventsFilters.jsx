import React from 'react';

import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CategoryIcon from '@mui/icons-material/Category';
import CheckIcon from '@mui/icons-material/Check';
import TagIcon from '@mui/icons-material/Tag';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/system';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";

export const EventsFilters = ({ filters, changeFilters, categoriesList }) => {
    const handleGetRooms = async () => {
        const result = await Api.roomsApi.getAllRooms();

        if (result?.result) {
            return result?.rooms;
        }

        return [];
    };

    const handleGetSeasons = async () => {
        const result = await Api.seasonsApi.getAllSeasons();

        if (result?.result) {
            return result?.seasons;
        }

        return [];
    };

    const handleGetTags = async () => {
        const result = await Api.tagsApi.getAllTags();

        if (result?.result) {
            return result?.tags;
        }

        return [];
    };

    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            <Component.CmtBooleanFilters
                value={filters.active}
                setValue={(newValue) => changeFilters({ ...filters, active: newValue })}
                title="Chercher par status"
                label="Actif ?"
                id="activeFilter"
                icon={<CheckIcon />}
            />

            <Component.CmtSearchFilters
                value={filters.name}
                setValue={(newValue) => changeFilters({ ...filters, name: newValue })}
                title="Chercher par nom"
                label="Nom"
                id="nameFilter"
                icon={<TextFieldsIcon />}
            />

            <Component.CmtCategoriesFilters
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

            <Component.CmtMultipleSelectFilters
                value={filters.room}
                setValue={(newValue) => {
                    changeFilters({ ...filters, room: newValue });
                }}
                title="Chercher par salle"
                label="Salles"
                id="roomFilter"
                icon={<BusinessIcon />}
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                getList={handleGetRooms}
            />

            <Component.CmtMultipleSelectFilters
                value={filters.season}
                setValue={(newValue) => {
                    changeFilters({ ...filters, season: newValue });
                }}
                title="Chercher par saison"
                label="Saisons"
                icon={<CalendarMonthIcon />}
                id="seasonFilter"
                parameters={{
                    nameValue: 'id',
                    nameLabel: 'name',
                }}
                getList={handleGetSeasons}
            />

            <Component.CmtMultipleSelectFilters
                value={filters.tags}
                setValue={(newValue) => {
                    changeFilters({ ...filters, tags: newValue });
                }}
                title="Chercher par tags"
                label="Tags"
                icon={<TagIcon />}
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
