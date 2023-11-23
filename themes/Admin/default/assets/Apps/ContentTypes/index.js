import React from 'react';

import { ContentTypeFieldArrayForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/ContentTypeFieldArrayForm';
import { FieldArrayElem } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/FieldArrayElem';
import { MainPartFieldForm } from '@Apps/ContentTypes/ContentTypesForm/FieldArray/MainPartFieldForm';
import { ContentTypesForm } from '@Apps/ContentTypes/ContentTypesForm/ContentTypesForm';
import { PageTypesForm } from '@Apps/ContentTypes/ContentTypesForm/PageTypesForm';
import { FieldElemWrapper, FieldFormControl } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import { ContentTypesFilters } from '@Apps/ContentTypes/ContentTypesList/ContentTypesFilters/ContentTypesFilters';
import { ContentTypesList } from '@Apps/ContentTypes/ContentTypesList/ContentTypesList';
import { PageTypesList } from '@Apps/ContentTypes/ContentTypesList/PageTypesList';
import { ContentTypesMenu } from '@Apps/ContentTypes/ContentTypesMenu/ContentTypesMenu';
import { CreateContentType } from '@Apps/ContentTypes/CreateContentType/CreateContentType';
import { CreatePageType } from '@Apps/ContentTypes/CreateContentType/CreatePageType';
import { EditContentType } from '@Apps/ContentTypes/EditContentType/EditContentType';
import { EditPageType } from '@Apps/ContentTypes/EditContentType/EditPageType';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import contentTypesReducer from './redux/contentTypes/contentTypesSlice';
import pageTypesReducer from './redux/pageTypes/pageTypesSlice';
import contentTypesApi from './services/api/contentTypesApi';

import WidgetsIcon from '@mui/icons-material/Widgets';

export const initConstant = () => {
    setConstant('CONTENT_TYPES_BASE_PATH', '/admin/types-de-contenus');
    setConstant('PAGE_TYPES_BASE_PATH', '/admin/types-de-pages');
};

export const initComponent = () => {
    setComponent('ContentTypeFieldArrayForm', ContentTypeFieldArrayForm);
    setComponent('FieldArrayElem', FieldArrayElem);
    setComponent('MainPartFieldForm', MainPartFieldForm);
    setComponent('ContentTypesForm', ContentTypesForm);
    setComponent('PageTypesForm', PageTypesForm);
    setComponent('FieldElemWrapper', FieldElemWrapper);
    setComponent('FieldFormControl', FieldFormControl);
    setComponent('ContentTypesFilters', ContentTypesFilters);
    setComponent('ContentTypesList', ContentTypesList);
    setComponent('PageTypesList', PageTypesList);
    setComponent('ContentTypesMenu', ContentTypesMenu);
    setComponent('CreateContentType', CreateContentType);
    setComponent('CreatePageType', CreatePageType);
    setComponent('EditContentType', EditContentType);
    setComponent('EditPageType', EditPageType);
};

export const initApi = () => {
    setApi('contentTypesApi', contentTypesApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CONTENT_TYPES_BASE_PATH, Component.ContentTypesMenu, { tabValue: 0 });
    setAuthenticatedRoute(Constant.CONTENT_TYPES_BASE_PATH + Constant.CREATE_PATH, Component.CreateContentType);
    setAuthenticatedRoute(`${Constant.CONTENT_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContentType);

    setAuthenticatedRoute(Constant.PAGE_TYPES_BASE_PATH, Component.ContentTypesMenu, { tabValue: 1 });
    setAuthenticatedRoute(Constant.PAGE_TYPES_BASE_PATH + Constant.CREATE_PATH, Component.CreatePageType);
    setAuthenticatedRoute(`${Constant.PAGE_TYPES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPageType);
};

export const initMenu = () => {
    insertSubMenu(2, 'ADMINISTRER', 'Types de contenus', Constant.CONTENT_TYPES_BASE_PATH, <WidgetsIcon />, { relatedLinks: [Constant.PAGE_TYPES_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('contentTypes', contentTypesReducer);
    setReducer('pageTypes', pageTypesReducer);
};
