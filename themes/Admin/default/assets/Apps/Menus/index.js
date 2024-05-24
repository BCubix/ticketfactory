import React from 'react';

import { CreateMenu, menusCreateForm } from '@Apps/Menus/CreateMenu/CreateMenu';
import { DisplayMenuElement, RenderElement } from '@Apps/Menus/MenusList/MenuStructure/DisplayMenuElement';
import { MenuStructure } from '@Apps/Menus/MenusList/MenuStructure/MenuStructure';
import { DraggableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DraggableBox';
import { DroppableBox } from '@Apps/Menus/MenusList/MenuStructure/sc.DroppableBox';
import { MoveElementButton } from '@Apps/Menus/MenusList/MenuStructure/sc.MoveElementButton';
import { AddMenuElement } from '@Apps/Menus/MenusList/AddMenuElement';
import { MenuHeaderLine } from '@Apps/Menus/MenusList/MenuHeaderLine';
import { MenusList } from '@Apps/Menus/MenusList/MenusList';

import { setReducer } from '@/AdminService/Reducer';
import { insertSubMenu } from '@/AdminService/Menu';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';

import menusReducer from './redux/menus/menusSlice';
import menusListDataReducer from './redux/menus/menusListDataSlice';
import menusApi from './services/api/menusApi';
import { setCrud } from '@/AdminService/Crud';

import MenuIcon from '@mui/icons-material/Menu';
import { menusEditCrud } from './MenusList/MenusList';
import { addTabElements } from '@/AdminService/Tab';

export const initConstant = () => {
    setConstant('MENUS_BASE_PATH', '/admin/menus');
};

export const initComponent = () => {
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

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.MENUS_BASE_PATH, Component.CmtAppMenu, {
        tabListName: 'menusTabList',
        path: Constant.MENUS_BASE_PATH,
    });
    setAuthenticatedRoute(Constant.MENUS_BASE_PATH + Constant.CREATE_PATH, Component.CreateMenu);
};

export const initMenu = () => {
    insertSubMenu(1, 'PERSONNALISER', 'Menus', Constant.MENUS_BASE_PATH, <MenuIcon />);
};

export const initReducer = () => {
    setReducer('menus', menusReducer);
    setReducer('menusListData', menusListDataReducer);
};

export const initTab = () => {
    addTabElements('menusTabList', [{ label: 'Menus', component: <Component.MenusList />, path: Constant.MENUS_BASE_PATH }]);
};

export const initCrud = () => {
    const crud = {
        add: menusCreateForm,
        edit: menusEditCrud,
    };

    setCrud('menus', crud);
};
