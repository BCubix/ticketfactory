import React from 'react';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeImageFormatsFilters, getImageFormatsAction, imageFormatsSelector } from '@Apps/ImageFormats/redux/imageFormats/imageFormatSlice';

export const imageFormatsListCrud = {
    title: "Formats d'image",
    listTitle: "Liste des formats d'image",
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
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'themeUse', label: 'Utilisé par le thème principal ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '30%', sortable: true },
        { name: 'width', label: 'Largeur', width: '15%', sortable: true },
        { name: 'height', label: 'Hauteur', width: '15%', sortable: true },
    ],
    loadDataAction: () => getImageFormatsAction(),
    changeFiltersActions: (props, page) => changeImageFormatsFilters(props, page),
    dataSelector: imageFormatsSelector,
    dataList: (selector) => selector.imageFormats,
    delete: (props) => Api.imageFormatsApi.deleteImageFormat(props),
    links: {
        new: () => `${Constant.IMAGE_FORMATS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.IMAGE_FORMATS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
    bottomComponents: [{ component: () => <Component.ImageFormatParameters /> }, { component: () => <Component.ImageFormatGenerate /> }],
    deleteComponent: ({ deleteDialog, setDeleteDialog, handleDelete }) => (
        <Component.DeleteDialog open={deleteDialog ? true : false} onCancel={() => setDeleteDialog(null)} onDelete={() => handleDelete(deleteDialog)}>
            <Box textAlign="center" py={3}>
                <Typography component="p">Êtes-vous sûr de vouloir supprimer ce format d'image ?</Typography>
                <Typography component="p">Les miniatures seront supprimées.</Typography>
                <Typography component="p">Cette action est irréversible.</Typography>
            </Box>
        </Component.DeleteDialog>
    ),
};

export const ImageFormatsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.imageFormats?.list} />;
};
