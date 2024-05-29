import React from 'react';
import { CreateTag, tagsCreateCrud } from '@Apps/Tags/CreateTag/CreateTag';
import { EditTag, tagsEditCrud } from '@Apps/Tags/EditTag/EditTag';
import { TagsList, tagsListCrud } from '@Apps/Tags/TagsList/TagsList';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';

import tagsReducer from '@Apps/Tags/redux/tags/tagsSlice';
import tagsApi from '@Apps/Tags/services/api/tagsApi';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('TAGS_BASE_PATH', '/admin/tags');
};

export const initComponent = () => {
    setComponent('CreateTag', CreateTag);
    setComponent('EditTag', EditTag);
    setComponent('TagsList', TagsList);
};

export const initApi = () => {
    setApi('tagsApi', tagsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.TAGS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'eventTabList',
        tabPathValue: Constant.TAGS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.TAGS_BASE_PATH + Constant.CREATE_PATH, Component.CreateTag);
    setAuthenticatedRoute(`${Constant.TAGS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditTag);
};

export const initReducer = () => {
    setReducer('tags', tagsReducer);
};

export const initTab = () => {
    addTabElements('eventTabList', [{ label: 'Tags', component: <Component.TagsList />, path: Constant.TAGS_BASE_PATH }], 3);
};

export const initCrud = () => {
    const crud = {
        list: tagsListCrud,
        add: tagsCreateCrud,
        edit: tagsEditCrud,
    };

    setCrud('tags', crud);
};
