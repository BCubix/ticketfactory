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
import dashboardApi from './services/api/dashboardApi';

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
};

export const initAuthenticatedRoutes = () => {
    setAuthenticatedRoute(Constant.HOME_PATH, Component.Home, { exact: true });
};

export const initReducer = () => {
    setReducer('dashboard', dashboardReducer);
};
