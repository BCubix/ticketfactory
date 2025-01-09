import React from 'react';
import SourceIcon from '@mui/icons-material/Source';

import { ContentsForm } from '@Apps/Contents/ContentsForm/ContentsForm';
import { DisplayContentField } from '@Apps/Contents/ContentsForm/DisplayContentField';
import { DisplayContentForm } from '@Apps/Contents/ContentsForm/DisplayContentForm';
import { ContentsList, contentsListCrud } from '@Apps/Contents/ContentsList/ContentsList';
import { ContentMenuButton, ContentMenuTitle } from '@Apps/Contents/ContentsList/sc.ContentMenuButton';
import { CreateContent, contentsCreateCrud } from '@Apps/Contents/CreateContent/CreateContent';
import { EditContent, contentsEditCrud } from '@Apps/Contents/EditContent/EditContent';
import { ContentCrudList } from './ContentsList/ContentCrudList';
import contentsReducer from './redux/contents/contentsSlice';
import contentsApi from './services/api/contentsApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_CONTENT_READ';
const ROLE_CREATE = 'ROLE_CONTENT_CREATE';
const ROLE_EDIT = 'ROLE_CONTENT_EDIT';

export const initConstant = () => {
    setConstant('CONTENTS_BASE_PATH', '/admin/contenus');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('ContentsForm', ContentsForm);
    setComponent('DisplayContentField', DisplayContentField);
    setComponent('DisplayContentForm', DisplayContentForm);
    setComponent('ContentsList', ContentsList);
    setComponent('CreateContent', CreateContent);
    setComponent('EditContent', EditContent);
    setComponent('ContentMenuButton', ContentMenuButton);
    setComponent('ContentMenuTitle', ContentMenuTitle);
    setComponent('ContentCrudList', ContentCrudList);
};

export const initApi = () => {
    setApi('contentsApi', contentsApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.CONTENTS_BASE_PATH, Component.ContentsList);

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.CONTENTS_BASE_PATH + Constant.CREATE_PATH, Component.CreateContent);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.CONTENTS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditContent);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(3, 'PERSONNALISER', 'Contenus', Constant.CONTENTS_BASE_PATH, <SourceIcon />);
};

export const initReducer = () => {
    setReducer('contents', contentsReducer);
};

export const initCrud = () => {
    const crud = {
        list: contentsListCrud,
        add: contentsCreateCrud,
        edit: contentsEditCrud,
    };

    setCrud('contents', crud);
};
