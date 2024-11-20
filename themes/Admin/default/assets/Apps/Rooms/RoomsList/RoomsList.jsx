import React from 'react';

import { Api } from '@/AdminService/Api';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { changeRoomsFilters, getRoomsAction, roomsSelector } from '@Apps/Rooms/redux/rooms/roomsSlice';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const roomsListCrud = {
    title: 'Salles',
    listTitle: 'Liste des salles',
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
        { key: 'active', title: 'Chercher par status', label: 'Actif ?', type: 'boolean' },
        { key: 'name', title: 'Chercher par nom', label: 'Nom', type: 'search' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'seatsNb', label: 'Nombre de places', width: '15%', sortable: true },
        { name: 'area', label: 'Superficie', width: '15%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getRoomsAction(),
    changeFiltersActions: (props, page) => changeRoomsFilters(props, page),
    dataSelector: roomsSelector,
    dataList: (selector) => selector.rooms,
    duplicate: (props) => Api.roomsApi.duplicateRoom(props),
    delete: (props) => Api.roomsApi.deleteRoom(props),
    checkUserAccess: {
        new: (userRoles) => checkUserAccess(userRoles, 'ROLE_ROOM_CREATE'),
        edit: (userRoles) => checkUserAccess(userRoles, 'ROLE_ROOM_EDIT'),
        delete: (userRoles) => checkUserAccess(userRoles, 'ROLE_ROOM_DELETE'),
    },
    links: {
        new: () => `${Constant.ROOMS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.ROOMS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.ROOMS_BASE_PATH}${Constant.CREATE_PATH}?roomId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: 'La salle a bien été dupliquée',
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette salle ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const RoomsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.rooms?.list} />;
};
