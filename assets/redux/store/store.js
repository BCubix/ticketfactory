import { combineReducers, configureStore } from '@reduxjs/toolkit';

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
import modulesReducer from '../modules/modulesSlice';

const reducer = {
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
    modules: modulesReducer,
}

const store = configureStore({
    reducer: { ...reducer },
});

store.asyncReducers = {};

store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers))
};

function createReducer(asyncReducers) {
    return combineReducers({
        ...reducer,
        ...asyncReducers,
    });
}

export default store;
