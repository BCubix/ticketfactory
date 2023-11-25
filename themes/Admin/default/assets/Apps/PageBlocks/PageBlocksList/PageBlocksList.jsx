import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changePageBlocksFilters, getPageBlocksAction, pageBlocksSelector } from '@Apps/PageBlocks/redux/pageBlocks/pageBlocksSlice';

export const pageBlocksListCrud = {
    title: 'Blocs',
    listTitle: 'Liste des blocs',
    filtersData: [
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
    filterList: [{ key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' }],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '60%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getPageBlocksAction(),
    changeFiltersActions: (props) => changePageBlocksFilters(props),
    dataSelector: pageBlocksSelector,
    dataList: (selector) => selector.pageBlocks,
    duplicate: (props) => Api.pageBlocksApi.duplicatePageBlock(props),
    delete: (props) => Api.pageBlocksApi.deletePageBlock(props),
    links: {
        new: () => `${Constant.PAGEBLOCKS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.PAGEBLOCKS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.PAGEBLOCKS_BASE_PATH}${Constant.CREATE_PATH}?pageBlockId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'La saison a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const PageBlocksList = () => {
    return <Component.CmtCrudList listCrud={Crud?.pageBlocks?.list} />;
};
