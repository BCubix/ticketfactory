import React from 'react';

import { CreatePage } from '@Apps/Pages/CreatePage/CreatePage';
import { EditPage } from '@Apps/Pages/EditPage/EditPage';
import { PagesBlocksPart } from '@Apps/Pages/PagesForm/PagesBlocksPart';
import { PagesForm } from '@Apps/Pages/PagesForm/PagesForm';
import { PagesBlocksSliderPart } from '@Apps/Pages/PagesForm/PagesBlocksSliderPart';
import { PagesFilters } from '@Apps/Pages/PagesList/PagesFilters/PagesFilters';
import { PagesList } from '@Apps/Pages/PagesList/PagesList';
import { PagesMenu } from '@Apps/Pages/PagesMenu/PagesMenu';
import { ImportPageBlock } from '@Apps/Pages/PagesForm/ImportPageBlock';
import { PageHistory } from '@Apps/Pages/PageHistory/PageHistory';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import pagesApi from '@Apps/Pages/services/api/pagesApi';
import pageHistoryApi from '@Apps/Pages/services/api/pageHistoryApi';
import pagesReducer from '@Apps/Pages/redux/pages/pagesSlice';

import DescriptionIcon from '@mui/icons-material/Description';

export const initConstant = () => {
    setConstant('PAGES_BASE_PATH', '/admin/pages');
    setConstant('PAGE_HISTORY_BASE_PATH', '/admin/historique-de-page');
};

export const initComponent = () => {
    setComponent('CreatePage', CreatePage);
    setComponent('EditPage', EditPage);
    setComponent('PagesBlocksPart', PagesBlocksPart);
    setComponent('ImportPageBlock', ImportPageBlock);
    setComponent('PagesForm', PagesForm);
    setComponent('PagesBlocksSliderPart', PagesBlocksSliderPart);
    setComponent('PagesFilters', PagesFilters);
    setComponent('PagesList', PagesList);
    setComponent('PagesMenu', PagesMenu);
    setComponent('PageHistory', PageHistory);
};

export const initApi = () => {
    setApi('pagesApi', pagesApi);
    setApi('pageHistoryApi', pageHistoryApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.PAGES_BASE_PATH, Component.PagesMenu, { tabValue: 0 });
    setAuthenticatedRoute(Constant.PAGES_BASE_PATH + Constant.CREATE_PATH, Component.CreatePage);
    setAuthenticatedRoute(`${Constant.PAGES_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditPage);

    setAuthenticatedRoute(`${Constant.PAGE_HISTORY_BASE_PATH}/:id`, Component.PageHistory);
};

export const initMenu = () => {
    insertSubMenu(2, 'PERSONNALISER', 'Pages', Constant.PAGES_BASE_PATH, <DescriptionIcon />, { relatedLinks: [Constant.PAGE_BLOCKS_BASE_PATH, Constant.PAGE_HISTORY_BASE_PATH] });
};

export const initReducer = () => {
    setReducer('pages', pagesReducer);
};
