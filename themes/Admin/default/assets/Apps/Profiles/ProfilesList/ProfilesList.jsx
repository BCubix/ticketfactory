import React from 'react';

import { changeProfilesFilters, getProfilesAction, profilesSelector } from '@Apps/Profiles/redux/profiles/profilesSlice';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { Api } from '@/AdminService/Api';

export const profilesListCrud = {
    title: 'Profils',
    listTitle: 'Liste des profils',
    filtersData: [
        'name',
        'page',
        'limit',
        { key: 'active', type: 'boolean' },
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
    tableContextualMenu: false,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '70%', sortable: true },
    ],
    loadDataAction: () => getProfilesAction(),
    changeFiltersActions: (props, page) => changeProfilesFilters(props, page),
    dataSelector: profilesSelector,
    dataList: (selector) => selector.profiles,
    delete: (props) => Api.profilesApi.deleteProfile(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_PRODUCT_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_PRODUCT_EDIT'),
    },
    links: {
        new: () => `${Constant.PROFILES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PROFILES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce profil ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const ProfilesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.profiles?.list} />;
};
