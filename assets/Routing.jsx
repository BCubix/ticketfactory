import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';

import { Backdrop, CircularProgress } from '@mui/material';

import { AuthenticatedRoute } from "@/AdminService/AuthenticatedRoute";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { NonAuthenticatedRoute } from "@/AdminService/NonAuthenticatedRoute";

import { profileSelector } from '@Redux/profile/profileSlice';

import '@Style/index.scss';

const AuthenticatedLayout = ({ children }) => {
    const { connected, loading } = useSelector(profileSelector);

    if (connected) {
        return <Component.Layout>{children}</Component.Layout>;
    }

    if (loading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (connected === null) {
        return <></>;
    }

    return <Navigate replace to={Constant.LOGIN_PATH} />;
};

export const Routing = () => {
    return (
        <Routes>
            {NonAuthenticatedRoute.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    exact={item.exact ? true : false}
                    element={
                        item.tabValue
                            ? <item.component tabValue={item.tabValue} />
                            : <item.component />
                    }
                />
            ))}

            {AuthenticatedRoute.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    exact={item.exact ? true : false}
                    element={
                        <AuthenticatedLayout>
                            {item.tabValue
                                ? <item.component tabValue={item.tabValue} />
                                : <item.component />
                            }
                        </AuthenticatedLayout>
                    }
                />
            ))}
        </Routes>
    );
};
