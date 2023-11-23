import React from 'react';

import { ContentsForm } from '@Apps/Contents/ContentsForm/ContentsForm';
import { DisplayContentField } from '@Apps/Contents/ContentsForm/DisplayContentField';
import { DisplayContentForm } from '@Apps/Contents/ContentsForm/DisplayContentForm';
import { ContentsFilters } from '@Apps/Contents/ContentsList/ContentsFilters/ContentsFilters';
import { ContentsList } from '@Apps/Contents/ContentsList/ContentsList';
import { CreateContent } from '@Apps/Contents/CreateContent/CreateContent';
import { EditContent } from '@Apps/Contents/EditContent/EditContent';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import contentsReducer from './redux/contents/contentsSlice';
import contentsApi from './services/api/contentsApi';

import SourceIcon from '@mui/icons-material/Source';

export const initConstant = () => {
    setConstant('CONTENT_BASE_PATH', '/admin/contenus');
};

export const initComponent = () => {
    setComponent('ContentsForm', ContentsForm);
    setComponent('DisplayContentField', DisplayContentField);
    setComponent('DisplayContentForm', DisplayContentForm);
    setComponent('ContentsFilters', ContentsFilters);
    setComponent('ContentsList', ContentsList);
    setComponent('CreateContent', CreateContent);
    setComponent('EditContent', EditContent);
};

export const initApi = () => {
    setApi('contentsApi', contentsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.CONTENT_BASE_PATH, Component.ContentsList);
    setAuthenticatedRoute(Constant.CONTENT_BASE_PATH + Constant.CREATE_PATH, Component.CreateContent);
    setAuthenticatedRoute(`${Constant.CONTENT_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContent);
};

export const initMenu = () => {
    insertSubMenu(2, 'PERSONNALISER', 'Contenus', Constant.CONTENT_BASE_PATH, <SourceIcon />);
};

export const initReducer = () => {
    setReducer('contents', contentsReducer);
};
