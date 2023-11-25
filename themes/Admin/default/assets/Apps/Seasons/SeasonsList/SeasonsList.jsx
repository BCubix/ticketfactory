import React from 'react';

import { changeSeasonsFilters, getSeasonsAction, seasonsSelector } from '@Apps/Seasons/redux/seasons/seasonsSlice';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

export const seasonsListCrud = {
    title: 'Saisons',
    listTitle: 'Liste des saisons',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'beginYear',
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
    loadDataAction: () => getSeasonsAction(),
    changeFiltersActions: (props) => changeSeasonsFilters(props),
    dataSelector: seasonsSelector,
    dataList: (selector) => selector.seasons,
    duplicate: (props) => Api.seasonsApi.duplicateSeason(props),
    delete: (props) => Api.seasonsApi.deleteSeason(props),
    links: {
        new: () => `${Constant.SEASONS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.SEASONS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.SEASONS_BASE_PATH}${Constant.CREATE_PATH}?seasonId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'La saison a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const SeasonsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.seasons?.list} />;
};
