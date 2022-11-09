import { createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { profileInitAction, profileSelector } from '@Redux/profile/profileSlice';
import { getParametersAction, parametersSelector } from './redux/parameters/parametersSlice';
import { NotificationContainer } from 'react-notifications';
import defaultTheme from './services/themes/defaultTheme';
import { CmtLayoutProvider } from './Components/CmtLayoutProvider/CmtLayoutProvider';
import { Routing } from './Routing';
import '@Style/index.scss';
import 'react-notifications/lib/notifications.css';
import 'moment/locale/fr';

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
            <CmtLayoutProvider>
                <BrowserRouter>
                    <Routing />
                    <NotificationContainer />
                </BrowserRouter>
            </CmtLayoutProvider>
        </ThemeProvider>
    );
};
