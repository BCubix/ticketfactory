import React from 'react';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeTagsFilters, getTagsAction, tagsSelector } from '@Apps/Tags/redux/tags/tagsSlice';

export const tagsListCrud = {
    title: 'Tags',
    listTitle: 'Liste des tags',
    filtersData: [
        { key: 'active', type: 'boolean' },
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
    loadDataAction: () => getTagsAction(),
    changeFiltersActions: (props) => changeTagsFilters(props),
    dataSelector: tagsSelector,
    dataList: (selector) => selector.tags,
    duplicate: (props) => Api.tagsApi.duplicateTag(props),
    delete: (props) => Api.tagsApi.deleteTag(props),
    links: {
        new: () => `${Constant.TAGS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.TAGS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.TAGS_BASE_PATH}${Constant.CREATE_PATH}?tagId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'Le tag a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer ce tag ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const TagsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.tags?.list} />;
};
