import React from 'react';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

import { Api } from '@/AdminService/Api';
import CheckIcon from '@mui/icons-material/Check';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import TagIcon from '@mui/icons-material/Tag';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { useDispatch } from 'react-redux';

const CategoriesFilterWrapper = ({ getList, dispatch, ...props }) => {
    const handleGetList = async (props) => {
        const categories = await Api.categoriesApi.getCategories(props);
        if (categories.result) {
            return categories?.categories;
        }

        return {};
    };

    return (
        <Component.CmtCategoriesFilters
            title="Chercher par catégories"
            label="Catégories"
            id="categoryFilter"
            icon={<CategoryIcon />}
            getList={getList || handleGetList}
            {...props}
        />
    );
};

const RoomFilterWrapper = ({ getList, dispatch, ...props }) => {
    const handleGetList = async (props) => {
        const result = await Api.roomsApi.getAllRooms(props);

        if (result?.result) {
            return result?.rooms;
        }

        return [];
    };

    return (
        <Component.CmtMultipleSelectFilters
            title="Chercher par salle"
            label="Salles"
            id="roomFilter"
            icon={<BusinessIcon />}
            parameters={{
                nameValue: 'id',
                nameLabel: 'name',
            }}
            getList={getList || handleGetList}
            {...props}
        />
    );
};

const SeasonFilterWrapper = ({ getList, dispatch, ...props }) => {
    const handleGetList = async (props) => {
        const result = await Api.seasonsApi.getAllSeasons(props);

        if (result?.result) {
            return result?.seasons;
        }

        return [];
    };

    return (
        <Component.CmtMultipleSelectFilters
            title="Chercher par saison"
            label="Saisons"
            icon={<CalendarMonthIcon />}
            id="seasonFilter"
            parameters={{
                nameValue: 'id',
                nameLabel: 'name',
            }}
            getList={getList || handleGetList}
            {...props}
        />
    );
};

const TagFilterWrapper = ({ getList, dispatch, ...props }) => {
    const handleGetList = async (props) => {
        const result = await Api.tagsApi.getAllTags(props);

        if (result?.result) {
            return result?.tags;
        }

        return [];
    };

    return (
        <Component.CmtMultipleSelectFilters
            title="Chercher par tags"
            label="Tags"
            icon={<TagIcon />}
            id="tagFilter"
            parameters={{
                nameValue: 'id',
                nameLabel: 'name',
            }}
            getList={getList || handleGetList}
            {...props}
        />
    );
};

const ContentTypeFilterWrapper = ({ getList, dispatch, ...props }) => {
    const handleGetList = async (props) => {
        const result = await Api.contentTypesApi.getAllContentTypes(props);

        if (result?.result) {
            return result?.contentTypes;
        }

        return [];
    };

    return (
        <Component.CmtMultipleSelectFilters
            title="Chercher par type de contenu"
            label="Type de contenu"
            icon={<WidgetsIcon />}
            id="tagFilter"
            parameters={{
                nameValue: 'id',
                nameLabel: 'name',
            }}
            getList={getList || handleGetList}
            {...props}
        />
    );
};

const FILTERS_TYPE = {
    boolean: (props) => <Component.CmtBooleanFilters icon={<CheckIcon />} {...props} />,
    search: (props) => <Component.CmtSearchFilters icon={<TextFieldsIcon />} {...props} />,
    categories: (props) => <CategoriesFilterWrapper {...props} />,
    rooms: (props) => <RoomFilterWrapper {...props} />,
    seasons: (props) => <SeasonFilterWrapper {...props} />,
    tags: (props) => <TagFilterWrapper {...props} />,
    contentTypes: (props) => <ContentTypeFilterWrapper {...props} />,
    multipleList: (props) => <Component.CmtMultipleSelectFilters {...props} />,
};

export const CmtFiltersList = ({ filters, filtersList, changeFilters }) => {
    const dispatch = useDispatch();

    return (
        <Box p={3} flexGrow={1} display="flex" justifyContent="flex-start" flexWrap="wrap">
            {filtersList?.map((item, index) => {
                const { key, getValue, type, component: FilterComponent, ...props } = item;

                if (FilterComponent) {
                    return (
                        <FilterComponent
                            key={index}
                            value={getValue ? getValue(filters) : filters[key]}
                            setValue={(newValue) => changeFilters({ ...filters, [key]: newValue })}
                            id={`${key}Filter`}
                            {...props}
                        />
                    );
                }

                const Filter = FILTERS_TYPE[type];
                if (!Filter) {
                    return <></>;
                }

                return (
                    <Filter
                        key={index}
                        value={getValue ? getValue(filters) : filters[key]}
                        setValue={(newValue) => changeFilters({ ...filters, [key]: newValue })}
                        id={`${key}Filter`}
                        dispatch={dispatch}
                        {...props}
                    />
                );
            })}
        </Box>
    );
};
