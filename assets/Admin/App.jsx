import React, { useEffect } from 'react';
import { NotificationContainer } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import 'moment/locale/fr';

import { createTheme, ThemeProvider } from '@mui/material';

import { Component } from "@/AdminService/Component";

import { profileInitAction, profileSelector } from '@Redux/profile/profileSlice';
import { getParametersAction, parametersSelector } from '@Redux/parameters/parametersSlice';

import defaultTheme from '@Services/themes/defaultTheme';

import '@Style/index.scss';

export const App = () => {
    const { connected, loading } = useSelector(profileSelector);
    const parametersData = useSelector(parametersSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (connected === null && !loading) {
            dispatch(profileInitAction());
        }
    }, []);

    useEffect(() => {
        if (!connected || parametersData?.parameters || parametersData?.loading) {
            return;
        }

        dispatch(getParametersAction());
    }, [connected]);

    return (
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <Component.CmtLayoutProvider>
                <BrowserRouter>
                    <Component.Routing />
                    <NotificationContainer />
                </BrowserRouter>
            </Component.CmtLayoutProvider>
        </ThemeProvider>
    );
};
