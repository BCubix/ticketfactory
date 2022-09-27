import { Backdrop, CircularProgress, createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
    CATEGORIES_BASE_PATH,
    CONTACT_REQUEST_BASE_PATH,
    CONTENT_BASE_PATH,
    CONTENT_TYPES_BASE_PATH,
    CREATE_PATH,
    EDIT_PATH,
    EVENTS_BASE_PATH,
    HOME_PATH,
    IMAGE_FORMATS_BASE_PATH,
    LOGIN_PATH,
    LOGS_BASE_PATH,
    MEDIAS_BASE_PATH,
    MENUS_BASE_PATH,
    PAGES_BASE_PATH,
    REDIRECTIONS_BASE_PATH,
    ROOMS_BASE_PATH,
    SEASONS_BASE_PATH,
    TAGS_BASE_PATH,
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
import { CreateCategory } from './Apps/Categories/CreateCategory/CreateCategory';
import { EditCategory } from './Apps/Categories/EditCategory/EditCategory';
import { RoomsList } from './Apps/Rooms/RoomsList/RoomsList';
import { CreateRoom } from './Apps/Rooms/CreateRoom/CreateRoom';
import { EditRoom } from './Apps/Rooms/EditRoom/EditRoom';
import { SeasonsList } from './Apps/Seasons/SeasonsList/SeasonsList';
import { CreateSeason } from './Apps/Seasons/CreateSeason/CreateSeason';
import { EditSeason } from './Apps/Seasons/EditSeason/EditSeason';
import { EditEvent } from './Apps/Events/EditEvent/EditEvent';
import { LogsList } from './Apps/Logs/LogsList/LogsList';
import { CategoriesMenu } from './Apps/Categories/CategoriesMenu/CategoriesMenu';
import { CreateTag } from './Apps/Tags/CreateTag/CreateTag';
import { EditTag } from './Apps/Tags/EditTag/EditTag';
import defaultTheme from './services/themes/defaultTheme';
import { CmtLayoutProvider } from './Components/CmtLayoutProvider/CmtLayoutProvider';
import { CreateImageFormat } from './Apps/ImageFormat/CreateImageFormat/CreateImageFormat';
import { EditImageFormat } from './Apps/ImageFormat/EditImageFormat/EditImageFormat';
import { MediasMenu } from './Apps/Medias/MediasMenu/MediasMenu';
import { ContentTypesList } from './Apps/ContentTypes/ContentTypesList/ContentTypesList';
import { CreateContentType } from './Apps/ContentTypes/CreateContentType/CreateContentType';
import { EditContentType } from './Apps/ContentTypes/EditContentType/EditContentType';
import { ContentsList } from './Apps/Contents/ContentsList/ContentsList';
import { CreateContent } from './Apps/Contents/CreateContent/CreateContent';
import { ContactRequestsList } from './Apps/ContactRequests/ContactRequestsList/ContactRequestsList';
import { CreateContactRequests } from './Apps/ContactRequests/CreateContactRequest/CreateContactRequest';
import { EditContactRequest } from './Apps/ContactRequests/EditContactRequest/EditContactRequest';
import { RedirectionsList } from './Apps/Redirections/RedirectionsList/RedirectionsList';
import { CreateRedirection } from './Apps/Redirections/CreateRedirection/CreateRedirection';
import { EditRedirection } from './Apps/Redirections/EditRedirection/EditRedirection';
import { MenusList } from './Apps/Menus/MenusList/MenusList';
import PagesList from "@Apps/Pages/PagesList/PagesList";
import CreatePage from "@Apps/Pages/CreatePage/CreatePage";
import EditPage from "@Apps/Pages/EditPage/EditPage";

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
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <CmtLayoutProvider>
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

                        <Route
                            path={`${EVENTS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditEvent />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CATEGORIES_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CategoriesMenu tabValue={0} />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${CATEGORIES_BASE_PATH}/:id`}
                            element={
                                <AuthenticatedLayout>
                                    <CategoriesMenu tabValue={0} />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CATEGORIES_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateCategory />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={TAGS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CategoriesMenu tabValue={1} />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${CATEGORIES_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditCategory />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={TAGS_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateTag />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${TAGS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditTag />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={ROOMS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <RoomsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={ROOMS_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateRoom />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${ROOMS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditRoom />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={SEASONS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <SeasonsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={SEASONS_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateSeason />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${SEASONS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditSeason />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={LOGS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <LogsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={MEDIAS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <MediasMenu tabValue={0} />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={IMAGE_FORMATS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <MediasMenu tabValue={1} />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={IMAGE_FORMATS_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateImageFormat />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${IMAGE_FORMATS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditImageFormat />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTENT_TYPES_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <ContentTypesList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTENT_TYPES_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateContentType />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${CONTENT_TYPES_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditContentType />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTENT_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <ContentsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTENT_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateContent />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTACT_REQUEST_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <ContactRequestsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={CONTACT_REQUEST_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateContactRequests />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${CONTACT_REQUEST_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditContactRequest />
                                </AuthenticatedLayout>
                            }
                        />
                        <Route
                            path={REDIRECTIONS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <RedirectionsList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={REDIRECTIONS_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreateRedirection />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${REDIRECTIONS_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditRedirection />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={MENUS_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <MenusList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={PAGES_BASE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <PagesList />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={PAGES_BASE_PATH + CREATE_PATH}
                            element={
                                <AuthenticatedLayout>
                                    <CreatePage />
                                </AuthenticatedLayout>
                            }
                        />

                        <Route
                            path={`${PAGES_BASE_PATH}/:id${EDIT_PATH}`}
                            element={
                                <AuthenticatedLayout>
                                    <EditPage />
                                </AuthenticatedLayout>
                            }
                        />
                    </Routes>
                    <NotificationContainer />
                </BrowserRouter>
            </CmtLayoutProvider>
        </ThemeProvider>
    );
};
