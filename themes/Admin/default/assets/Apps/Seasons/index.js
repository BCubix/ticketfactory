import React from 'react';

import { CreateSeason, seasonsCreateCrud } from '@Apps/Seasons/CreateSeason/CreateSeason';
import { EditSeason, seasonsEditCrud } from '@Apps/Seasons/EditSeason/EditSeason';
import { SeasonsList, seasonsListCrud } from '@Apps/Seasons/SeasonsList/SeasonsList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import seasonsReducer from '@Apps/Seasons/redux/seasons/seasonsSlice';
import seasonsApi from '@Apps/Seasons/services/api/seasonsApi';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('SEASONS_BASE_PATH', '/admin/saisons');
};

export const initComponent = () => {
    setComponent('CreateSeason', CreateSeason);
    setComponent('EditSeason', EditSeason);
    setComponent('SeasonsList', SeasonsList);
};

export const initApi = () => {
    setApi('seasonsApi', seasonsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        path: Constant.SEASONS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH, Component.CreateSeason);
    setAuthenticatedRoute(`${Constant.SEASONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditSeason);
};

export const initMenu = () => {
    insertSubMenu(1, 'PROGRAMMATION', 'Référentiels', Constant.SEASONS_BASE_PATH, <CalendarMonthIcon />, {
        relatedLinks: [Constant.ROOMS_BASE_PATH],
    });
};

export const initReducer = () => {
    setReducer('seasons', seasonsReducer);
};

export const initTab = () => {
    addTabElements('seasonsTabList', [{ label: 'Saisons', component: <Component.SeasonsList />, path: Constant.SEASONS_BASE_PATH }], 2);
};

export const initCrud = () => {
    const crud = {
        list: seasonsListCrud,
        add: seasonsCreateCrud,
        edit: seasonsEditCrud,
    };

    setCrud('seasons', crud);
};
