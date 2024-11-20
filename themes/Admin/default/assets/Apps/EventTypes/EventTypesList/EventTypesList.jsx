import React from 'react';

import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeEventTypesFilters, getEventTypesAction, eventTypesSelector } from '@Apps/EventTypes/redux/eventTypes/eventTypesSlice';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const eventTypesListCrud = {
    title: 'Types',
    listTitle: 'Liste des types',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'name',
        'page',
        'lang',
        'limit',
        {
            key: 'sort',
            transformFilter: (params, sort) => {
                const splitSort = sort?.split(' ');

                params['filters[sortField]'] = splitSort[0];
                params['filters[sortOrder]'] = splitSort[1];
            },
        },
    ],
    filterList: [
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '45%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getEventTypesAction(),
    changeFiltersActions: (props, page) => changeEventTypesFilters(props, page),
    dataSelector: eventTypesSelector,
    dataList: (selector) => selector.eventTypes,
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_EVENT_TYPE_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_EVENT_TYPE_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_EVENT_TYPE_DELETE'),
    },
    links: {
        edit: (id) => `${Constant.EVENT_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        duplicateValidation: 'Le type a bien été dupliquée',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const EventTypesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.eventTypes?.list} />;
};
