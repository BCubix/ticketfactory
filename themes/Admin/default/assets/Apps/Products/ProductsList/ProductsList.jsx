import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { changeProductsFilters, productsSelector, getProductsAction } from '@Apps/Products/redux/products/productsSlice';

import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Crud } from '@/AdminService/Crud';

export const productsListCrud = {
    title: 'Produits',
    listTitle: 'Liste des produits',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'name',
        {
            key: 'category',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[category][${index}]`] = el;
                });
            },
        },
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
        { name: 'id', label: 'ID', width: '5%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '30%', sortable: true },
        { name: 'mainCategory.name', label: 'Catégorie', width: '20%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getProductsAction(),
    changeFiltersActions: (props, page) => changeProductsFilters(props, page),
    dataSelector: productsSelector,
    dataList: (selector) => selector.products,
    duplicate: (props) => Api.productsApi.duplicateProduct(props),
    delete: (props) => Api.productsApi.deleteProduct(props),
    links: {
        new: () => `${Constant.PRODUCTS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PRODUCTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.PRODUCTS_BASE_PATH}${Constant.CREATE_PATH}?productId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'Le produit a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const ProductsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.products?.list} />;
};
