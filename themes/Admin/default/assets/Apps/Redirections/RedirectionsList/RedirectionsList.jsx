import React from 'react';
import { redirectionsSelector } from '@Apps/Redirections/redux/redirections/redirectionsSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeRedirectionsFilters, getRedirectionsAction } from '@Apps/Redirections/redux/redirections/redirectionsSlice';
import CategoryIcon from '@mui/icons-material/Category';

export const redirectionsListCrud = {
    title: 'Redirections',
    listTitle: 'Liste des redirections',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'redirectType',
        'redirectFrom',
        'redirectTo',
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
        {
            key: 'redirectType',
            title: 'Chercher par type de redirection',
            label: 'Type de redirection',
            type: 'multipleList',
            icon: <CategoryIcon />,
            parameters: {
                nameValue: 'value',
                nameLabel: 'label',
            },
            list: Constant.REDIRECTION_TYPES,
        },
        { key: 'redirectFrom', title: 'Chercher par source de la redirection', label: 'Redirigé depuis', type: 'search' },
        { key: 'redirectTo', title: 'Chercher par destination de la redirection', label: 'Redirigé vers', type: 'search' },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'redirectType', label: 'Type de redirection', width: '20%', sortable: true },
        { name: 'redirectFrom', label: 'Redirigé depuis', width: '25%', sortable: true },
        { name: 'redirectTo', label: 'Redirigé vers', width: '25%', sortable: true },
    ],
    loadDataAction: () => getRedirectionsAction(),
    changeFiltersActions: (props) => changeRedirectionsFilters(props),
    dataSelector: redirectionsSelector,
    dataList: (selector) => selector.redirections,
    delete: (props) => Api.redirectionsApi.deleteRedirection(props),
    links: {
        new: () => `${Constant.REDIRECTIONS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.REDIRECTIONS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const RedirectionsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.redirections?.list} />;
};
