import React, { useEffect } from 'react';
import { NotificationContainer } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import 'moment/locale/fr';
import { createTheme, ThemeProvider } from '@mui/material';

import { userProfileInitAction, userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getParametersAction, parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { getLanguagesAction, languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

import { Component } from '@/AdminService/Component';
import defaultTheme from '@Services/themes/defaultTheme';

import '@Style/index.scss';

export const App = () => {
    const { connected, loading } = useSelector(userProfileSelector);
    const parametersData = useSelector(parametersSelector);
    const languagesData = useSelector(languagesSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (connected === null && !loading) {
            dispatch(userProfileInitAction());
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
