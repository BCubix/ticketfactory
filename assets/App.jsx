import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
    CREATE_PATH,
    EDIT_PATH,
    EVENTS_BASE_PATH,
    HOME_PATH,
    LOGIN_PATH,
    USER_BASE_PATH,
} from './Constant';
import { profileInitAction, profileSelector } from '@Redux/profile/profileSlice';
import '@Style/index.scss';
import 'react-notifications/lib/notifications.css';

import { Layout } from '@Components/Layout/Layout';
import { Home } from '@Apps/Home/Home';
import { Login } from '@Apps/Login/Login';
import { UserList } from '@Apps/Users/UserList/UserList';
import { CreateUser } from '@Apps/Users/CreateUser/CreateUser';
import { NotificationContainer } from 'react-notifications';
import { EditUser } from './Apps/Users/EditUser/EditUser';
import { EventsList } from './Apps/Events/EventsList/EventsList';
import { CreateEvent } from './Apps/Events/CreateEvent/CreateEvent';

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
                    path={USER_BASE_PATH}
                    element={
                        <AuthenticatedLayout>
                            <UserList />
                        </AuthenticatedLayout>
                    }
                />
                <Route
                    path={USER_BASE_PATH + CREATE_PATH}
                    element={
                        <AuthenticatedLayout>
                            <CreateUser />
                        </AuthenticatedLayout>
                    }
                />

                <Route
                    path={`${USER_BASE_PATH}/:id${EDIT_PATH}`}
                    element={
                        <AuthenticatedLayout>
                            <EditUser />
                        </AuthenticatedLayout>
                    }
                />

                <Route
                    path={EVENTS_BASE_PATH}
                    element={
                        <AuthenticatedLayout>
                            <EventsList />
                        </AuthenticatedLayout>
                    }
                />

                <Route
                    path={EVENTS_BASE_PATH + CREATE_PATH}
                    element={
                        <AuthenticatedLayout>
                            <CreateEvent />
                        </AuthenticatedLayout>
                    }
                />
            </Routes>
            <NotificationContainer />
        </BrowserRouter>
    );
};
