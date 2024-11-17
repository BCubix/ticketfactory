import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

import { CreateMenu, menusCreateForm } from '@Apps/Menus/CreateMenu/CreateMenu';
import { DisplayMenuElement, RenderElement } from '@Apps/Menus/MenusList/MenuStructure/DisplayMenuElement';
import { MenuStructure } from '@Apps/Menus/MenusList/MenuStructure/MenuStructure';
import { DraggableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DraggableBox';
import { DroppableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DroppableBox';
import { MoveElementButton } from '@Apps/Menus/MenusList/MenuStructure/sc.MoveElementButton';
import { AddMenuElement } from '@Apps/Menus/MenusList/AddMenuElement';
import { MenuHeaderLine } from '@Apps/Menus/MenusList/MenuHeaderLine';
import { MenusList, menusEditCrud } from '@Apps/Menus/MenusList/MenusList';
import menusReducer from './redux/menus/menusSlice';
import menusListDataReducer from './redux/menus/menusListDataSlice';
import menusApi from './services/api/menusApi';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { setCrud } from '@/AdminService/Crud';
import { addTabElements } from '@/AdminService/Tab';
import { checkUserAccess } from '@Services/utils/checkUserAccess';

export const initConstant = () => {
    setConstant('MENUS_BASE_PATH', '/admin/menus');
};

export const initComponent = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MENU_READ')) {
        return;
    }

    setComponent('CreateMenu', CreateMenu);
    setComponent('DisplayMenuElement', DisplayMenuElement);
    setComponent('RenderElement', RenderElement);
    setComponent('MenuStructure', MenuStructure);
    setComponent('DraggableBox', DraggableBox);
    setComponent('DroppableBox', DroppableBox);
    setComponent('MoveElementButton', MoveElementButton);
    setComponent('AddMenuElement', AddMenuElement);
    setComponent('MenuHeaderLine', MenuHeaderLine);
    setComponent('MenusList', MenusList);
};

export const initApi = () => {
    setApi('menusApi', menusApi);
};

export const initAuthenticatedRoutes = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MENU_READ')) {
        return;
    }

    setAuthenticatedRoute(Constant.MENUS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'menusTabList',
        tabPathValue: Constant.MENUS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.MENUS_BASE_PATH + Constant.CREATE_PATH, Component.CreateMenu);
};

export const initMenu = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MENU_READ')) {
        return;
    }

    insertSubMenu(1, 'PERSONNALISER', 'Menus', Constant.MENUS_BASE_PATH, <MenuIcon />);
};

export const initReducer = () => {
    setReducer('menus', menusReducer);
    setReducer('menusListData', menusListDataReducer);
};

export const initTab = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MENU_READ')) {
        return;
    }

    addTabElements('menusTabList', [{ label: 'Menus', component: <Component.MenusList />, path: Constant.MENUS_BASE_PATH }]);
};

export const initCrud = ({ userRoles }) => {
    if (!checkUserAccess(userRoles, 'ROLE_MENU_READ')) {
        return;
    }

    const crud = {
        add: menusCreateForm,
        edit: menusEditCrud,
    };

    setCrud('menus', crud);
};
