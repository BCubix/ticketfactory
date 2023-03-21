import React, { useEffect } from 'react';
import { NotificationContainer } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import 'moment/locale/fr';

import { createTheme, ThemeProvider } from '@mui/material';

import { Component } from '@/AdminService/Component';

import { profileInitAction, profileSelector } from '@Redux/profile/profileSlice';
import { getParametersAction, parametersSelector } from '@Redux/parameters/parametersSlice';
import { getLanguagesAction, languagesSelector } from '@Redux/languages/languagesSlice';

import defaultTheme from '@Services/themes/defaultTheme';

import '@Style/index.scss';

export const App = () => {
    const { connected, loading } = useSelector(profileSelector);
    const parametersData = useSelector(parametersSelector);
    const languagesData = useSelector(languagesSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (connected === null && !loading) {
            dispatch(profileInitAction());
        }
    }, []);

    useEffect(() => {
        if (!connected) {
            return;
        }

        if (!parametersData?.parameters && !parametersData?.loading) {
            dispatch(getParametersAction());
        }

        if (!languagesData?.parameters && !languagesData?.loading) {
            dispatch(getLanguagesAction());
        }
    }, [connected]);

    if (null === connected || (connected && (!languagesData?.languages || !parametersData?.parameters))) {
        return <></>;
    }

    return (
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <Component.AppProvider>
                <BrowserRouter>
                    <Component.Routing />
                    <NotificationContainer />
                </BrowserRouter>
            </Component.AppProvider>
        </ThemeProvider>
    );
};
