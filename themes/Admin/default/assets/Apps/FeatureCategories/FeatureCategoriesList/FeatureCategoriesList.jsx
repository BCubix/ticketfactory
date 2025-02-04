import React from 'react';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeFeatureCategoriesFilters, getFeatureCategoriesAction, featureCategoriesSelector } from '@Apps/FeatureCategories/redux/featureCategories/featureCategoriesSlice';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const featureCategoriesListCrud = {
    title: "Catégories d'Attributs",
    listTitle: "Liste des catégories d'attributs",
    filtersData: [
        { key: 'active', type: 'boolean' },
        'name',
        'keyword',
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
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'keyword', label: 'Mot-clé', width: '20%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getFeatureCategoriesAction(),
    changeFiltersActions: (props, page) => changeFeatureCategoriesFilters(props, page),
    dataSelector: featureCategoriesSelector,
    dataList: (selector) => selector.featureCategories,
    duplicate: (props) => Api.featureCategoriesApi.duplicateFeatureCategory(props),
    delete: (props) => Api.featureCategoriesApi.deleteFeatureCategory(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_FEATURE_CATEGORY_DELETE'),
    },
    links: {
        new: () => `${Constant.FEATURE_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.FEATURE_CATEGORIES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.FEATURE_CATEGORIES_BASE_PATH}${Constant.CREATE_PATH}?featureCategoryId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: "La catégorie d'attribut a bien été dupliquée",
        confirmationDelete: "Êtes-vous sûr de vouloir supprimer cette catégorie d'attribut ?",
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const FeatureCategoriesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.featureCategories?.list} />;
};
