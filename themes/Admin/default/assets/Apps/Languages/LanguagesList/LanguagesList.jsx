import React from 'react';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { DEFAULT_CRUD_LIST_COMPONENTS } from '@Components/CmtCrudList/CmtCrudList';

import { getLanguagesAction, languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { Crud } from '@/AdminService/Crud';

export const languagesListCrud = {
    title: 'Langues',
    listTitle: 'Liste des langues',
    tableList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
        { name: 'isoCode', label: 'Code ISO', width: '15%' },
    ],
    loadDataAction: () => getLanguagesAction(),
    dataSelector: languagesSelector,
    dataList: (selector) => selector.languages,
    delete: (props) => Api.languagesApi.deleteLanguage(props),
    links: {
        new: () => `${Constant.LANGUAGES_BASE_PATH}${Constant.CREATE_PATH}`,
        edit: (id) => `${Constant.LANGUAGES_BASE_PATH}/${id}${Constant.EDIT_PATH}`,
    },
    messages: {
        confirmationDelete: 'Êtes-vous sûr de vouloir supprimer cette langue ?',
    },
    ...DEFAULT_CRUD_LIST_COMPONENTS,
};

export const LanguagesList = () => {
    return <Component.CmtCrudList listCrud={Crud?.languages?.list} />;
};
