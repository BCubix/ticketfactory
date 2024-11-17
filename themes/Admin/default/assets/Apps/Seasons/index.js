import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { CreateSeason, seasonsCreateCrud } from '@Apps/Seasons/CreateSeason/CreateSeason';
import { EditSeason, seasonsEditCrud } from '@Apps/Seasons/EditSeason/EditSeason';
import { SeasonsList, seasonsListCrud } from '@Apps/Seasons/SeasonsList/SeasonsList';
import seasonsReducer from '@Apps/Seasons/redux/seasons/seasonsSlice';
import seasonsApi from '@Apps/Seasons/services/api/seasonsApi';

import { setReducer } from '@/AdminService/Reducer';
import { getSubMenu, insertSubMenu, setSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('SEASONS_BASE_PATH', '/admin/saisons');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_SEASON_READ')) {
        return;
    }

    setComponent('CreateSeason', CreateSeason);
    setComponent('EditSeason', EditSeason);
    setComponent('SeasonsList', SeasonsList);
};

export const initApi = () => {
    setApi('seasonsApi', seasonsApi);
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_SEASON_READ')) {
        return;
    }

    insertSubMenu(5, 'ADMINISTRER', 'Référentiels', null, <CalendarMonthIcon />, {});
};

export const initReducer = () => {
    setReducer('seasons', seasonsReducer);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_SEASON_READ')) {
        return;
    }

    const crud = {
        list: seasonsListCrud,
        add: seasonsCreateCrud,
        edit: seasonsEditCrud,
    };

    setCrud('seasons', crud);
};

export default async function ({ parameters, userRoles }) {
    if (!checkUserAccess(userRoles, 'ROLE_SEASON_READ')) {
        return;
    }

    const useSeasons = parameters?.find((el) => el.paramKey === 'core_use_seasons');
    if (!useSeasons?.paramValue) {
        return;
    }

    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'seasonsTabList',
        tabPathValue: Constant.SEASONS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.SEASONS_BASE_PATH + Constant.CREATE_PATH, Component.CreateSeason);
    setAuthenticatedRoute(`${Constant.SEASONS_BASE_PATH}/:id${Constant.EDIT_PATH}`, Component.EditSeason);

    addTabElements('seasonsTabList', [{ label: 'Saisons', component: <Component.SeasonsList />, path: Constant.SEASONS_BASE_PATH }], 1);

    let subMenu = getSubMenu('ADMINISTRER', 'Référentiels');
    if (!subMenu) {
        return;
    }

    setSubMenu(subMenu.position, 'ADMINISTRER', 'Référentiels', subMenu.link, subMenu.icon, {
        ...subMenu.options,
        linkList: [...(subMenu.linkList || []), { link: Constant.SEASONS_BASE_PATH, position: 1 }],
        relatedLinks: [...(subMenu.relatedLinks || []), Constant.SEASONS_BASE_PATH],
    });
}
