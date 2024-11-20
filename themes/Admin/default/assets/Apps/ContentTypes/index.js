import React from 'react';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { ContentTypeFieldArrayForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/ContentTypeFieldArrayForm';
import { FieldArrayElem } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/FieldArrayElem';
import { MainPartFieldForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/MainPartFieldForm';
import { FieldElemWrapper, FieldFormControl } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import { ContentTypesList, contentTypesListCrud } from '@Apps/ContentTypes/ContentTypesList/ContentTypesList';
import { PageTypesList, pageTypesListCrud } from '@Apps/ContentTypes/ContentTypesList/PageTypesList';
import { CreateContentType, contentTypesCreateCrud } from '@Apps/ContentTypes/CreateContentType/CreateContentType';
import { CreatePageType, pageTypesCreateCrud } from '@Apps/ContentTypes/CreateContentType/CreatePageType';
import { EditContentType, contentTypesEditCrud } from '@Apps/ContentTypes/EditContentType/EditContentType';
import { EditPageType, pageTypesEditCrud } from '@Apps/ContentTypes/EditContentType/EditPageType';
import contentTypesReducer from './redux/contentTypes/contentTypesSlice';
import pageTypesReducer from './redux/pageTypes/pageTypesSlice';
import contentTypesApi from './services/api/contentTypesApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_CONTENT_TYPE_READ';
const ROLE_CREATE = 'ROLE_CONTENT_TYPE_CREATE';
const ROLE_EDIT = 'ROLE_CONTENT_TYPE_EDIT';

export const initConstant = () => {
    setConstant('CONTENT_TYPES_BASE_PATH', '/admin/types-de-contenus');
    setConstant('PAGE_TYPES_BASE_PATH', '/admin/types-de-pages');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ContentTypeFieldArrayForm', ContentTypeFieldArrayForm);
    setComponent('FieldArrayElem', FieldArrayElem);
    setComponent('MainPartFieldForm', MainPartFieldForm);
    setComponent('FieldElemWrapper', FieldElemWrapper);
    setComponent('FieldFormControl', FieldFormControl);
    setComponent('ContentTypesList', ContentTypesList);
    setComponent('PageTypesList', PageTypesList);
    setComponent('CreateContentType', CreateContentType);
    setComponent('CreatePageType', CreatePageType);
    setComponent('EditContentType', EditContentType);
    setComponent('EditPageType', EditPageType);
};

export const initApi = () => {
    setApi('contentTypesApi', contentTypesApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.CONTENT_TYPES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'contentTypesTabList',
        tabPathValue: Constant.CONTENT_TYPES_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.PAGE_TYPES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'contentTypesTabList',
        tabPathValue: Constant.PAGE_TYPES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.CONTENT_TYPES_BASE_PATH + Constant.CREATE_PATH, Component.CreateContentType);
        setAuthenticatedRoute(Constant.PAGE_TYPES_BASE_PATH + Constant.CREATE_PATH, Component.CreatePageType);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.CONTENT_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContentType);
        setAuthenticatedRoute(`${Constant.PAGE_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPageType);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(4, 'PARAMETRER', 'Types', Constant.CONTENT_TYPES_BASE_PATH, <WidgetsIcon />, { relatedLinks: [Constant.PAGE_TYPES_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('contentTypes', contentTypesReducer);
    setReducer('pageTypes', pageTypesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('contentTypesTabList', [
        { label: 'Types de contenus', component: <Component.ContentTypesList />, path: Constant.CONTENT_TYPES_BASE_PATH },
        { label: 'Types de pages', component: <Component.PageTypesList />, path: Constant.PAGE_TYPES_BASE_PATH },
    ]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const contentTypesCrud = {
        list: contentTypesListCrud,
        add: contentTypesCreateCrud,
        edit: contentTypesEditCrud,
    };

    setCrud('contentTypes', contentTypesCrud);

    const pageTypesCrud = {
        list: pageTypesListCrud,
        add: pageTypesCreateCrud,
        edit: pageTypesEditCrud,
    };

    setCrud('pageTypes', pageTypesCrud);
};
