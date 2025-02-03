import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { customersSelector, getCustomersAction, changeCustomersFilters } from '@Apps/Customers/redux/customers/customersSlice';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const customersListCrud = {
    title: 'Clients',
    listTitle: 'Liste des clients',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'email',
        'firstName',
        'lastName',
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
        { key: 'firstName', title: 'Chercher par prénom', label: 'Prénom', type: 'search', icon: <PersonIcon /> },
        { key: 'lastName', title: 'Chercher par nom', label: 'Nom', type: 'search', icon: <PersonIcon /> },
        { key: 'email', title: 'Chercher par email', label: 'Email', type: 'search', icon: <EmailIcon /> },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'civility', label: 'Civilité', width: '10%', sortable: false },
        { name: 'firstName', label: 'Prénom', width: '20%', sortable: true },
        { name: 'lastName', label: 'Nom', width: '20%', sortable: true },
        { name: 'email', label: 'Adresse Email', width: '20%', sortable: true },
    ],
    loadDataAction: () => getCustomersAction(),
    changeFiltersActions: (props, page) => changeCustomersFilters(props, page),
    dataSelector: customersSelector,
    dataList: (selector) => selector.customers,
    delete: (props) => Api.customersApi.deleteCustomer(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_CUSTOMER_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_CUSTOMER_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_CUSTOMER_DELETE'),
    },
    links: {
        new: () => `${Constant.CUSTOMERS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.CUSTOMERS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce client ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const CustomersList = () => {
    return <Component.CmtCrudList listCrud={Crud?.customers?.list} />;
};
