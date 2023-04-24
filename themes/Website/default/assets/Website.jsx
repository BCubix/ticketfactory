import React from 'react';
import { NotificationContainer } from 'react-notifications';
import { BrowserRouter } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import 'moment/locale/fr';
import '@WStyle/index.scss';

import defaultTheme from '@WServices/themes/defaultTheme';

import { createTheme, ThemeProvider } from '@mui/material';
import { Component } from '@Website/WebsiteService/Component';

export const Website = () => {
    return (
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <Component.Routing />
            <NotificationContainer />
        </ThemeProvider>
    );
};

export const WebsiteCustomerContainer = () => {
    return (
        <BrowserRouter>
            <Website />
        </BrowserRouter>
    );
};
