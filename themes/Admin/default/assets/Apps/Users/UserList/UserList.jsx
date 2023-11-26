import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeUsersFilters, getUsersAction, usersSelector } from '@Apps/Users/redux/users/usersSlice';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const usersListCrud = {
    title: 'Utilisateurs',
    listTitle: 'Liste des utilisateurs',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'email',
        'firstName',
        'lastName',
        'role',
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
        { key: 'email', title: 'Chercher par email', label: 'Email', type: 'search' },
        { key: 'firstName', title: 'Chercher par nom', label: 'Prénom', type: 'search' },
        { key: 'lastName', title: 'Chercher par nom', label: 'Nom', type: 'search' },
        { key: 'role', title: 'Chercher par role', label: 'Rôle', type: 'search' },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'firstName', label: 'Prénom', width: '15%', sortable: true },
        { name: 'lastName', label: 'Nom', width: '15%', sortable: true },
        { name: 'email', label: 'Adresse Email', width: '20%', sortable: true },
        { name: 'roles', label: 'Rôle', width: '20%', sortable: true },
    ],
    loadDataAction: () => getUsersAction(),
    changeFiltersActions: (props, page) => changeUsersFilters(props, page),
    dataSelector: usersSelector,
    dataList: (selector) => selector.users,
    delete: (props) => Api.usersApi.deleteUser(props),
    links: {
        new: () => `${Constant.USER_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.USER_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const UserList = () => {
    return <Component.CmtCrudList listCrud={Crud?.users?.list} />;
};
