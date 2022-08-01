import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CREATE_USER_PATH, HOME_PATH, LOGIN_PATH, USER_LIST_PATH } from './Constant';
import { profileInitAction, profileSelector } from '@Redux/profile/profileSlice';
import '@Style/index.scss';

import { Layout } from '@Components/Layout/Layout';
import { Home } from '@Apps/Home/Home';
import { Login } from '@Apps/Login/Login';
import { UserList } from '@Apps/Users/UserList/UserList';
import { CreateUser } from '@Apps/Users/CreateUser/CreateUser';

const AuthenticatedLayout = ({ children }) => {
    const { connected, loading } = useSelector(profileSelector);

    if (connected) {
        return <Layout>{children}</Layout>;
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

    return <Navigate replace to={LOGIN_PATH} />;
};

export const App = () => {
    const { connected, loading } = useSelector(profileSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (connected === null && !loading) {
            dispatch(profileInitAction());
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    exact
                    path={HOME_PATH}
                    element={
                        <AuthenticatedLayout>
                            <Home />
                        </AuthenticatedLayout>
                    }
                />
                <Route path={LOGIN_PATH} element={<Login />} />
                <Route
                    path={USER_LIST_PATH}
                    element={
                        <AuthenticatedLayout>
                            <UserList />
                        </AuthenticatedLayout>
                    }
                />
                <Route
                    path={CREATE_USER_PATH}
                    element={
                        <AuthenticatedLayout>
                            <CreateUser />
                        </AuthenticatedLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};
