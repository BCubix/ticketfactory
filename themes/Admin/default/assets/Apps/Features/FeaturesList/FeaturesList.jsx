import React from 'react';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeFeaturesFilters, getFeaturesAction, featuresSelector } from '@Apps/Features/redux/features/featuresSlice';

export const featuresListCrud = {
    title: 'Attributs',
    listTitle: 'Liste des attributs',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'name',
        'keyword',
        'type',
        { key: 'filter', type: 'boolean' },
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
        { key: 'keyword', title: 'Chercher par mot-clé', label: 'Mot-clé', type: 'search' },
        { key: 'filter', title: "L'élément est filtrable", label: 'Filtre ?', type: 'boolean' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'keyword', label: 'Mot-clé', width: '10%', sortable: true },
        { name: 'type', label: 'Type', width: '10%', sortable: false },
        { name: 'position', label: 'Position', width: '10%', sortable: false },
        { name: 'filter', label: 'Filtre ?', width: '10%', sortable: false, type: 'bool' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getFeaturesAction(),
    changeFiltersActions: (props, page) => changeFeaturesFilters(props, page),
    dataSelector: featuresSelector,
    dataList: (selector) => selector.features,
    duplicate: (props) => Api.featuresApi.duplicateFeature(props),
    delete: (props) => Api.featuresApi.deleteFeature(props),
    links: {
        new: () => `${Constant.FEATURES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.FEATURES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.FEATURES_BASE_PATH}${Constant.CREATE_PATH}?featureId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: "L'attribut a bien été dupliquée",
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cet attribut ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const FeaturesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.features?.list} />;
};
