import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import { NonAuthenticatedRoute } from '@Website/WebsiteService/NonAuthenticatedRoute';
import { Component } from '@Website/WebsiteService/Component';
import { Box } from '@mui/system';

export const Routing = () => {
    return (
        <Routes>
            {NonAuthenticatedRoute.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    exact={Boolean(item.exact)}
                    element={
                        <Component.Layout key={index}>
                            <item.component />
                        </Component.Layout>
                    }
                />
            ))}
        </Routes>
    );
};
