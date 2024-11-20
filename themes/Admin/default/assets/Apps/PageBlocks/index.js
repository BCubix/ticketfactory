import React from 'react';

import { PageBlockColumnPart } from '@Apps/PageBlocks/PageBlocksForm/PageBlockColumnPart';
import { CreatePageBlock, pageBlocksCreateCrud } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlock';
import { EditPageBlock, pageBlocksEditCrud } from '@Apps/PageBlocks/EditPageBlock/EditPageBlock';
import { PageBlocksForm } from '@Apps/PageBlocks/PageBlocksForm/PageBlocksForm';
import { PageBlocksList, pageBlocksListCrud } from '@Apps/PageBlocks/PageBlocksList/PageBlocksList';
import { CreatePageBlockFormat } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlockFormat';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { addTabElements } from '@/AdminService/Tab';

import pageBlocksApi from '@Apps/PageBlocks/services/api/pageBlocksApi';
import pageBlocksReducer from '@Apps/PageBlocks/redux/pageBlocks/pageBlocksSlice';
import { setCrud } from '@/AdminService/Crud';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_PAGE_BLOCK_READ';
const ROLE_CREATE = 'ROLE_PAGE_BLOCK_CREATE';
const ROLE_EDIT = 'ROLE_PAGE_BLOCK_EDIT';

export const initConstant = () => {
    setConstant('PAGE_BLOCKS_BASE_PATH', '/admin/page-blocks');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('PageBlockColumnPart', PageBlockColumnPart);
    setComponent('CreatePageBlock', CreatePageBlock);
    setComponent('EditPageBlock', EditPageBlock);
    setComponent('PageBlocksForm', PageBlocksForm);
    setComponent('PageBlocksList', PageBlocksList);
    setComponent('CreatePageBlockFormat', CreatePageBlockFormat);
};

export const initApi = () => {
    setApi('pageBlocksApi', pageBlocksApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.PAGE_BLOCKS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'pagesTabList',
        tabPathValue: Constant.PAGE_BLOCKS_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.PAGE_BLOCKS_BASE_PATH + Constant.CREATE_PATH, Component.CreatePageBlock);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.PAGE_BLOCKS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPageBlock);
    }
};

export const initReducer = () => {
    setReducer('pageBlocks', pageBlocksReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('pagesTabList', [{ label: 'Blocs', component: <Component.PageBlocksList />, path: Constant.PAGE_BLOCKS_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: pageBlocksListCrud,
        add: pageBlocksCreateCrud,
        edit: pageBlocksEditCrud,
    };

    setCrud('pageBlocks', crud);
};
