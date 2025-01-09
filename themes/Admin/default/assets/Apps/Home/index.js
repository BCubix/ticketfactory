import React from 'react';

import { FirstCardDashboard } from '@Apps/Home/FirstCardDashboard';
import { GraphChildrenDashboard } from '@Apps/Home/GraphChildrenDashboard';
import { Home } from '@Apps/Home/Home';
import { MainDashboard } from '@Apps/Home/MainDashboard';
import { GraphTabTitle } from '@Apps/Home/sc.Home';
import { SecondCardDashboard } from '@Apps/Home/SecondCardDashboard';
import { ThirdCardDashboard } from '@Apps/Home/ThirdCardDashboard';

import { setReducer } from '@/AdminService/Reducer';
import { setApi } from '@/AdminService/Api';
import { Constant, setConstant } from '@/AdminService/Constant';
import { Component, setComponent } from '@/AdminService/Component';
import { setAuthenticatedRoute } from '@/AdminService/AuthenticatedRoute';
import { Navigate } from 'react-router-dom';

import dashboardReducer from './redux/dashboard/dashboardSlice';
import notesReducer from './Notes/redux/notesSlice';
import toDoTasksReducer from  './ToDoList/redux/toDoTasksSlice';
import generalStatsReducer from './GeneralStats/redux/generalStatsSlice';

import dashboardApi from './services/api/dashboardApi';
import notesApi from './Notes/services/api/notesApi';
import toDoTasksApi from './ToDoList/services/api/toDoTasksApi';
import generalStatsApi from './GeneralStats/services/api/generalStatsApi';

export const initConstant = () => {
    setConstant('HOME_PATH', '/admin');
};

export const initComponent = () => {
    setComponent('FirstCardDashboard', FirstCardDashboard);
    setComponent('GraphChildrenDashboard', GraphChildrenDashboard);
    setComponent('Home', Home);
    setComponent('MainDashboard', MainDashboard);
    setComponent('GraphTabTitle', GraphTabTitle);
    setComponent('SecondCardDashboard', SecondCardDashboard);
    setComponent('ThirdCardDashboard', ThirdCardDashboard);
};

export const initApi = () => {
    setApi('dashboardApi', dashboardApi);
    setApi('notesApi', notesApi);
    setApi('toDoTasksApi', toDoTasksApi);
    setApi('generalStatsApi', generalStatsApi);
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.HOME_PATH, Component.Home, { exact: true });
};

export const initReducer = () => {
    setReducer('dashboard', dashboardReducer);
    setReducer('notes', notesReducer);
    setReducer('toDoTasks', toDoTasksReducer);
    setReducer('generalStats', generalStatsReducer);
};
