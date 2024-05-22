import React from 'react';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeEventTypesFilters, getEventTypesAction, eventTypesSelector } from '@Apps/EventTypes/redux/eventTypes/eventTypesSlice';

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
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '60%', sortable: true },
    ],
    loadDataAction: () => getEventTypesAction(),
    changeFiltersActions: (props, page) => changeEventTypesFilters(props, page),
    dataSelector: eventTypesSelector,
    dataList: (selector) => selector.eventTypes,
    duplicate: (props) => Api.eventTypesApi.duplicateEventType(props),
    delete: (props) => Api.eventTypesApi.deleteEventType(props),
    links: {
        new: () => `${Constant.EVENT_TYPES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.EVENT_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.EVENT_TYPES_BASE_PATH}${Constant.CREATE_PATH}?eventTypeId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'Le type a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce type ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const EventTypesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.eventTypes?.list} />;
};
