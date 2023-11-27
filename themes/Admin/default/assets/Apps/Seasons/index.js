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
    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH, Component.SeasonsList);
    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH, Component.CreateSeason);
    setAuthenticatedRoute(`${Constant.SEASONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditSeason);
};

export const initMenu = () => {
    insertSubMenu(4, 'PROGRAMMER', 'Saisons', Constant.SEASONS_BASE_PATH, <CalendarMonthIcon />);
};

export const initReducer = () => {
    setReducer('seasons', seasonsReducer);
};

export const initCrud = () => {
    const crud = {
        list: seasonsListCrud,
        add: seasonsCreateCrud,
        edit: seasonsEditCrud,
    };

    setCrud('seasons', crud);
};
