import React from 'react';

import { PageBlockTypesList, pageBlockTypesListCrud } from './PageBlockTypesList/PageBlockTypesList';
import pageBlockTypesReducer from './redux/pageBlockTypes/pageBlockTypesSlice';
import pageBlockTypesApi from './services/api/pageBlockTypesApi';
import { pageBlockTypesForm } from './PageBlockTypesForm/PageBlockTypesForm';
import { CreatePageBlockType, pageBlockTypesCreateCrud } from './CreatePageBlockType/CreatePageBlockType';
import { EditPageBlockType, pageBlockTypesEditCrud } from './EditPageBlockType/EditPageBlockType';

import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setApi } from '@/AdminService/Api';
import { setReducer } from '@/AdminService/Reducer';
import { checkUserAccess } from '@Services/utils/checkUserAccess';
import { addTabElements } from '@/AdminService/Tab';
import { setCrud } from '@/AdminService/Crud';

const ROLE_READ = 'ROLE_PAGE_BLOCK_TYPE_READ';
const ROLE_CREATE = 'ROLE_PAGE_BLOCK_TYPE_CREATE';
const ROLE_EDIT = 'ROLE_PAGE_BLOCK_TYPE_EDIT';

export const initConstant = () => {
    setConstant('PAGE_BLOCK_TYPES_BASE_PATH', '/admin/types-de-blocks');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('PageBlockTypesList', PageBlockTypesList);
    setComponent('PageBlockTypesForm', pageBlockTypesForm);
    setComponent('CreatePageBlockType', CreatePageBlockType);
    setComponent('EditPageBlockType', EditPageBlockType);
};

export const initApi = () => {
    setApi('pageBlockTypesApi', pageBlockTypesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.PAGE_BLOCK_TYPES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'contentTypesTabList',
        tabPathValue: Constant.PAGE_BLOCK_TYPES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.PAGE_BLOCK_TYPES_BASE_PATH + Constant.CREATE_PATH, Component.CreatePageBlockType);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.PAGE_BLOCK_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPageBlockType);
    }
};

export const initReducer = () => {
    setReducer('pageBlockTypes', pageBlockTypesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('contentTypesTabList', [{ label: 'Types de blocs', component: <Component.PageBlockTypesList />, path: Constant.PAGE_BLOCK_TYPES_BASE_PATH }], 1);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const pageBlockTypesCrud = {
        list: pageBlockTypesListCrud,
        add: pageBlockTypesCreateCrud,
        edit: pageBlockTypesEditCrud,
    };

    setCrud('pageBlockTypes', pageBlockTypesCrud);
};
