import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeContentTypesFilters, contentTypesSelector, getContentTypesAction } from '@Apps/ContentTypes/redux/contentTypes/contentTypesSlice';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const contentTypesListCrud = {
    title: 'Types de contenus',
    listTitle: 'Liste des types de contenus',
    filtersData: [
        { key: 'active', type: 'boolean' },
        { key: 'pageType', type: 'boolean' },
        'name',
        'page',
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
        { key: 'active', title: 'Chercher par status', label: 'Actif', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '70%', sortable: true },
    ],
    loadDataAction: () => getContentTypesAction(),
    changeFiltersActions: (props, page) => changeContentTypesFilters(props, page),
    dataSelector: contentTypesSelector,
    dataList: (selector) => selector.contentTypes,
    delete: (props) => Api.contentTypesApi.deleteSeason(props),
    links: {
        new: () => `${Constant.CONTENT_TYPES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.CONTENT_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce type de contenus ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const ContentTypesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.contentTypes?.list} />;
};
