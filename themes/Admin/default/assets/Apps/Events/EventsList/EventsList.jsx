import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getEventsAction, changeEventsFilters, eventsSelector } from '@Apps/Events/redux/events/eventsSlice';

import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Crud } from '@/AdminService/Crud';

export const eventsListCrud = {
    title: 'Evènements',
    listTitle: 'Liste des évènements',
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
        {
            key: 'season',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[season][${index}]`] = el;
                });
            },
        },
        {
            key: 'room',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[room][${index}]`] = el;
                });
            },
        },
        {
            key: 'tags',
            transformFilter: (params, values) => {
                values?.split(',').forEach((el, index) => {
                    params[`filters[tags][${index}]`] = el;
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
        { key: 'category', title: 'Chercher par catégories', label: 'Catégories', type: 'categories' },
        { key: 'room', title: 'Chercher par salle', label: 'Salles', type: 'rooms' },
        { key: 'season', title: 'Chercher par saison', label: 'Saisons', type: 'seasons' },
        { key: 'tags', title: 'Chercher par tags', label: 'Tags', type: 'tags' },
    ],
    pagination: true,
    tableContextualMenu: true,
    tableList: [
        { name: 'id', label: 'ID', width: '5%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'mainCategory.name', label: 'Catégorie', width: '10%', sortable: true },
        { name: 'room.name', label: 'Salle', width: '10%', sortable: true },
        { name: 'season.name', label: 'Saison', width: '10%', sortable: true },
        { name: 'tags.0.name', label: 'Tags', width: '10%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '10%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    loadDataAction: () => getEventsAction(),
    changeFiltersActions: (props, page) => changeEventsFilters(props, page),
    dataSelector: eventsSelector,
    dataList: (selector) => selector.events,
    duplicate: (props) => Api.eventsApi.duplicateEvent(props),
    delete: (props) => Api.eventsApi.deleteEvent(props),
    preview: (el) => {
        if (!el?.frontUrl) {
            return;
        }
        window.open(el.frontUrl, '_blank').focus();
    },
    links: {
        new: () => `${Constant.EVENTS_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.EVENTS_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.EVENTS_BASE_PATH}${Constant.CREATE_PATH}?eventId=${id}&languageId=${languageId}`,
    },
    messages: {
        duplicateValidation: "L'évènement a bien été dupliquée",
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const EventsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.events?.list} />;
};
