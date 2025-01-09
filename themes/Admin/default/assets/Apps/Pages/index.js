import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';

import { CreatePage, pagesCreateCrud } from '@Apps/Pages/CreatePage/CreatePage';
import { EditPage, pagesEditCrud } from '@Apps/Pages/EditPage/EditPage';
import { PagesBlocksPart } from '@Apps/Pages/PagesForm/PagesBlocksPart';
import { PagesForm } from '@Apps/Pages/PagesForm/PagesForm';
import { PagesList, pagesListCrud } from '@Apps/Pages/PagesList/PagesList';
import { ImportPageBlock } from '@Apps/Pages/PagesForm/ImportPageBlock';
import { PageBlockContentPart } from '@Apps/Pages/PagesForm/PageBlockContentPart';
import { PageHistory, pageHistoryCrud } from '@Apps/Pages/PageHistory/PageHistory';
import pagesApi from '@Apps/Pages/services/api/pagesApi';
import pageHistoryApi from '@Apps/Pages/services/api/pageHistoryApi';
import pagesReducer from '@Apps/Pages/redux/pages/pagesSlice';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

const ROLE_READ = 'ROLE_PAGE_READ';
const ROLE_CREATE = 'ROLE_PAGE_CREATE';
const ROLE_EDIT = 'ROLE_PAGE_EDIT';

export const initConstant = () => {
    setConstant('PAGES_BASE_PATH', '/admin/pages');
    setConstant('PAGE_HISTORY_BASE_PATH', '/admin/historique-de-page');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setComponent('CreatePage', CreatePage);
    setComponent('EditPage', EditPage);
    setComponent('PagesBlocksPart', PagesBlocksPart);
    setComponent('ImportPageBlock', ImportPageBlock);
    setComponent('PageBlockContentPart', PageBlockContentPart);
    setComponent('PagesForm', PagesForm);
    setComponent('PagesList', PagesList);
    setComponent('PageHistory', PageHistory);
};

export const initApi = () => {
    setApi('pagesApi', pagesApi);
    setApi('pageHistoryApi', pageHistoryApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    setAuthenticatedRoute(Constant.PAGES_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'pagesTabList',
        tabPathValue: Constant.PAGES_BASE_PATH,
    });

    if (checkUserAccess(userRoles, ROLE_CREATE)) {
        setAuthenticatedRoute(Constant.PAGES_BASE_PATH + Constant.CREATE_PATH, Component.CreatePage);
    }

    if (checkUserAccess(userRoles, ROLE_EDIT)) {
        setAuthenticatedRoute(`${Constant.PAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPage);
        setAuthenticatedRoute(`${Constant.PAGE_HISTORY_BASE_PATH}/:id`, Component.PageHistory);
    }
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    insertSubMenu(2, 'PERSONNALISER', 'Pages', Constant.PAGES_BASE_PATH, <DescriptionIcon />, { relatedLinks: [Constant.PAGE_BLOCKS_BASE_PATH, Constant.PAGE_HISTORY_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('pages', pagesReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    addTabElements('pagesTabList', [{ label: 'Pages', component: <Component.PagesList />, path: Constant.PAGES_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, ROLE_READ)) {
        return;
    }

    const crud = {
        list: pagesListCrud,
        add: pagesCreateCrud,
        edit: pagesEditCrud,
        history: pageHistoryCrud,
    };

    setCrud('pages', crud);
};
