import React from 'react';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import { changeContactRequestsFilters, contactRequestsSelector, getContactRequestsAction } from '../redux/contactRequests/contactRequestsSlice';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';
import { Crud } from '@/AdminService/Crud';

export const contactRequestsListCrud = {
    title: 'Demandes de contact',
    listTitle: 'Liste des demandes de contact',
    filtersData: [
        { key: 'active', type: 'boolean' },
        'email',
        'firstName',
        'lastName',
        'phone',
        'subject',
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
        { key: 'firstName', title: 'Chercher par nom', label: 'Prénom', type: 'search', icon: <PersonIcon /> },
        { key: 'lastName', title: 'Chercher par nom', label: 'Nom', type: 'search', icon: <PersonIcon /> },
        { key: 'email', title: 'Chercher par email', label: 'Email', type: 'search', icon: <EmailIcon /> },
        { key: 'phone', title: 'Chercher par téléphone', label: 'Téléphone', type: 'search', icon: <PhoneIcon /> },
        { key: 'subject', title: 'Chercher par object', label: 'Object', type: 'search', icon: <SubjectIcon /> },
    ],
    pagination: true,
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Gérée ?', type: 'bool', width: '10%', sortable: true },
        { name: 'firstName', label: 'Prénom', width: '10%', sortable: true },
        { name: 'lastName', label: 'Nom', width: '10%', sortable: true },
        { name: 'phone', label: 'Téléphone', width: '20%', sortable: true },
        { name: 'email', label: 'Email', width: '20%', sortable: true },
        { name: 'subject', label: 'Objet', width: '10%', sortable: true },
    ],
    loadDataAction: () => getContactRequestsAction(),
    changeFiltersActions: (props, page) => changeContactRequestsFilters(props, page),
    dataSelector: contactRequestsSelector,
    dataList: (selector) => selector.contactRequests,
    duplicate: (props) => Api.contactRequestsApi.duplicateContactRequest(props),
    delete: (props) => Api.contactRequestsApi.deleteContactRequest(props),
    links: {
        new: () => `${Constant.CONTACT_REQUEST_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.CONTACT_REQUEST_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
        translate: (id, languageId) => `${Constant.CONTACT_REQUEST_BASE_PATH}${Constant.CREATE_PATH}?contactRequestId=${id}&languageId=${languageId}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette demande ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const ContactRequestsList = () => {
    return <Component.CmtCrudList listCrud={Crud?.contactRequests?.list} />;
};
