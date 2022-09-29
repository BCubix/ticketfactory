import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
    CATEGORIES_BASE_PATH,
    CONTACT_REQUEST_BASE_PATH,
    CONTENT_BASE_PATH,
    CONTENT_TYPES_BASE_PATH,
    CREATE_PATH,
    EDIT_PATH,
    EVENTS_BASE_PATH,
    FORGOT_PASSWORD_PATH,
    HOME_PATH,
    IMAGE_FORMATS_BASE_PATH,
    LOGIN_PATH,
    LOGS_BASE_PATH,
    MEDIAS_BASE_PATH,
    MENUS_BASE_PATH,
    MODIFY_PASSWORD_PATH,
    PAGES_BASE_PATH,
    PARAMETERS_BASE_PATH,
    REDIRECTIONS_BASE_PATH,
    ROOMS_BASE_PATH,
    SEASONS_BASE_PATH,
    TAGS_BASE_PATH,
    USER_BASE_PATH,
} from './Constant';
import { profileSelector } from '@Redux/profile/profileSlice';
import '@Style/index.scss';
import 'react-notifications/lib/notifications.css';

import { Layout } from '@Components/Layout/Layout';
import { Home } from '@Apps/Home/Home';
import { Login } from '@Apps/Login/Login';
import { UserList } from '@Apps/Users/UserList/UserList';
import { CreateUser } from '@Apps/Users/CreateUser/CreateUser';
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
import PagesList from './Apps/Pages/PagesList/PagesList';
import CreatePage from './Apps/Pages/CreatePage/CreatePage';
import EditPage from './Apps/Pages/EditPage/EditPage';
import { EditContent } from './Apps/Contents/EditContent/EditContent';
import { ForgotPassword } from './Apps/ForgotPassword/ForgotPassword';
import { ChangePassword } from './Apps/ChangePassword/ChangePassword';
import ParametersMenu from "@Apps/Parameters/ParametersMenu/ParametersMenu";

const NON_AUTHENTICATED_ROUTES = [
    { path: LOGIN_PATH, component: <Login /> },
    { path: FORGOT_PASSWORD_PATH, component: <ForgotPassword /> },
    { path: MODIFY_PASSWORD_PATH, component: <ChangePassword /> },
];

const AUTHENTICATED_ROUTES = [
    { path: HOME_PATH, exact: true, component: <Home /> },

    { path: USER_BASE_PATH, component: <UserList /> },
    { path: USER_BASE_PATH + CREATE_PATH, component: <CreateUser /> },
    { path: `${USER_BASE_PATH}/:id${EDIT_PATH}`, component: <EditUser /> },

    { path: EVENTS_BASE_PATH, component: <EventsList /> },
    { path: EVENTS_BASE_PATH + CREATE_PATH, component: <CreateEvent /> },
    { path: `${EVENTS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditEvent /> },

    { path: CATEGORIES_BASE_PATH, component: <CategoriesMenu tabValue={0} /> },
    { path: `${CATEGORIES_BASE_PATH}/:id`, component: <CategoriesMenu tabValue={0} /> },
    { path: CATEGORIES_BASE_PATH + CREATE_PATH, component: <CreateCategory /> },
    { path: `${CATEGORIES_BASE_PATH}/:id${EDIT_PATH}`, component: <EditCategory /> },

    { path: TAGS_BASE_PATH, component: <CategoriesMenu tabValue={1} /> },
    { path: TAGS_BASE_PATH + CREATE_PATH, component: <CreateTag tabValue={1} /> },
    { path: `${TAGS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditTag tabValue={1} /> },

    { path: ROOMS_BASE_PATH, component: <RoomsList /> },
    { path: ROOMS_BASE_PATH + CREATE_PATH, component: <CreateRoom /> },
    { path: `${ROOMS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditRoom /> },

    { path: SEASONS_BASE_PATH, component: <SeasonsList /> },
    { path: SEASONS_BASE_PATH + CREATE_PATH, component: <CreateSeason /> },
    { path: `${SEASONS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditSeason /> },

    { path: LOGS_BASE_PATH, component: <LogsList /> },

    { path: MEDIAS_BASE_PATH, component: <MediasMenu tabValue={0} /> },

    { path: IMAGE_FORMATS_BASE_PATH, component: <MediasMenu tabValue={1} /> },
    { path: IMAGE_FORMATS_BASE_PATH + CREATE_PATH, component: <CreateImageFormat /> },
    { path: `${IMAGE_FORMATS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditImageFormat /> },

    { path: CONTENT_TYPES_BASE_PATH, component: <ContentTypesList /> },
    { path: CONTENT_TYPES_BASE_PATH + CREATE_PATH, component: <CreateContentType /> },
    { path: `${CONTENT_TYPES_BASE_PATH}/:id${EDIT_PATH}`, component: <EditContentType /> },

    { path: CONTENT_BASE_PATH, component: <ContentsList /> },
    { path: CONTENT_BASE_PATH + CREATE_PATH, component: <CreateContent /> },
    { path: `${CONTENT_BASE_PATH}/:id${EDIT_PATH}`, component: <EditContent /> },

    { path: CONTACT_REQUEST_BASE_PATH, component: <ContactRequestsList /> },
    { path: CONTACT_REQUEST_BASE_PATH + CREATE_PATH, component: <CreateContactRequests /> },
    { path: `${CONTACT_REQUEST_BASE_PATH}/:id${EDIT_PATH}`, component: <EditContactRequest /> },

    { path: REDIRECTIONS_BASE_PATH, component: <RedirectionsList /> },
    { path: REDIRECTIONS_BASE_PATH + CREATE_PATH, component: <CreateRedirection /> },
    { path: `${REDIRECTIONS_BASE_PATH}/:id${EDIT_PATH}`, component: <EditRedirection /> },

    { path: MENUS_BASE_PATH, component: <MenusList /> },

    { path: PAGES_BASE_PATH, component: <PagesList /> },
    { path: PAGES_BASE_PATH + CREATE_PATH, component: <CreatePage /> },
    { path: `${PAGES_BASE_PATH}/:id${EDIT_PATH}`, component: <EditPage /> },

    { path: PARAMETERS_BASE_PATH, component: <ParametersMenu /> },
];

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

export const Routing = () => {
    return (
        <Routes>
            {NON_AUTHENTICATED_ROUTES.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    exact={item.exact ? true : false}
                    element={item.component}
                />
            ))}

            {AUTHENTICATED_ROUTES.map((item, index) => (
                <Route
                    key={index}
                    path={item.path}
                    exact={item.exact ? true : false}
                    element={<AuthenticatedLayout>{item.component}</AuthenticatedLayout>}
                />
            ))}
        </Routes>
    );
};
