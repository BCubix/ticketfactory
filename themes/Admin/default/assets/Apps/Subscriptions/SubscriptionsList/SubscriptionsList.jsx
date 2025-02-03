import React from 'react';

import { changeSubscriptionsFilters, getSubscriptionsAction, subscriptionsSelector } from '@Apps/Subscriptions/redux/subscriptions/subscriptionsSlice';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Api } from '@/AdminService/Api';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const subscriptionsListCrud = {
    title: 'Abonnements',
    listTitle: 'Liste des abonnements',
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
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getSubscriptionsAction(),
    changeFiltersActions: (props, page) => changeSubscriptionsFilters(props, page),
    dataSelector: subscriptionsSelector,
    dataList: (selector) => selector.subscriptions,
    duplicate: (props) => Api.subscriptionsApi.duplicateSubscription(props),
    delete: (props) => Api.subscriptionsApi.deleteSubscription(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_SUBSCRIPTION_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_SUBSCRIPTION_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_SUBSCRIPTION_DELETE'),
    },
    links: {
        new: () => `${Constant.SUBSCRIPTIONS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.SUBSCRIPTIONS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        duplicateValidation: "L'abonnement a bien été dupliquée",
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cet abonnement ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const SubscriptionsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.subscriptions?.list} />;
};
