import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../profile/profileSlice';
import usersReducer from '../users/usersSlice';
import eventsReducer from '../events/eventsSlice';
import categoriesReducer from '../categories/categoriesSlice';
import roomsReducer from '../rooms/roomsSlice';
import seasonsReducer from '../seasons/seasonsSlice';
import tagsReducer from '../tags/tagsSlice';
import mediasReducer from '../medias/mediasSlice';
import imageFormatsReducer from '../imageFormats/imageFormatSlice';
import contentTypesReducer from '../contentTypes/contentTypesSlice';
import contentsReducer from '../contents/contentsSlice';
import contactRequestsReducer from '../contactRequests/contactRequestsSlice';
import redirectionsReducer from '../redirections/redirectionsSlice';
import menusReducer from '../menus/menusSlice';
import dashboardReducer from '../dashboard/dashboardSlice';
import pagesReducer from '../pages/pagesSlice';
import parametersReducer from '../parameters/parametersSlice';

export default configureStore({
    reducer: {
        profile: profileReducer,
        users: usersReducer,
        events: eventsReducer,
        categories: categoriesReducer,
        rooms: roomsReducer,
        seasons: seasonsReducer,
        tags: tagsReducer,
        medias: mediasReducer,
        imageFormats: imageFormatsReducer,
        contentTypes: contentTypesReducer,
        contents: contentsReducer,
        contactRequests: contactRequestsReducer,
        redirections: redirectionsReducer,
        menus: menusReducer,
        dashboard: dashboardReducer,
        pages: pagesReducer,
        parameters: parametersReducer,
    },
});
