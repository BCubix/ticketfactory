import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changePageBlockTypesFilters, pageBlockTypesSelector, getPageBlockTypesAction } from '@Apps/PageBlockTypes/redux/pageBlockTypes/pageBlockTypesSlice';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const pageBlockTypesListCrud = {
    title: 'Types de blocs',
    listTitle: 'Liste des types de blocs',
    filtersData: [
        { key: 'active', type: 'boolean' },
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
    loadDataAction: () => getPageBlockTypesAction(),
    changeFiltersActions: (props, page) => changePageBlockTypesFilters(props, page),
    dataSelector: pageBlockTypesSelector,
    dataList: (selector) => selector.pageBlockTypes,
    delete: (props) => Api.pageBlockTypesApi.deletePageBlockType(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_PAGE_BLOCK_TYPE_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_PAGE_BLOCK_TYPE_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_PAGE_BLOCK_TYPE_DELETE'),
    },
    links: {
        new: () => `${Constant.PAGE_BLOCK_TYPES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PAGE_BLOCK_TYPES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce type de bloc ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const PageBlockTypesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.pageBlockTypes?.list} />;
};
