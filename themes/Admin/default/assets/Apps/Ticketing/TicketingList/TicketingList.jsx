import React from 'react';

import { changeTicketingFilters, getTicketingAction, ticketingSelector } from '@Apps/Ticketing/redux/ticketing/ticketingSlice';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const ticketingListCrud = {
    title: 'Billetteries',
    listTitle: 'Liste des billetteries',
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
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
    ],
    loadDataAction: () => getTicketingAction(),
    changeFiltersActions: (props, page) => changeTicketingFilters(props, page),
    dataSelector: ticketingSelector,
    dataList: (selector) => selector.ticketing,
    delete: (props) => Api.ticketingApi.deleteTicketing(props),
    links: {
        new: () => `${Constant.TICKETING_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.TICKETING_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.TICKETING_BASE_PATH}${Constant.CREATE_PATH}?roomId=${id}&languageId=${languageId}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette billetterie ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const TicketingList = () => {
    return <Component.CmtCrudList listCrud={Crud?.ticketing?.list} />;
};
