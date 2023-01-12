import { combineReducers, configureStore } from '@reduxjs/toolkit';

import profileReducer from '@Redux/profile/profileSlice';
import usersReducer from '@Redux/users/usersSlice';
import eventsReducer from '@Redux/events/eventsSlice';
import categoriesReducer from '@Redux/categories/categoriesSlice';
import roomsReducer from '@Redux/rooms/roomsSlice';
import seasonsReducer from '@Redux/seasons/seasonsSlice';
import tagsReducer from '@Redux/tags/tagsSlice';
import mediasReducer from '@Redux/medias/mediasSlice';
import imageFormatsReducer from '@Redux/imageFormats/imageFormatSlice';
import contentTypesReducer from '@Redux/contentTypes/contentTypesSlice';
import contentsReducer from '@Redux/contents/contentsSlice';
import contactRequestsReducer from '@Redux/contactRequests/contactRequestsSlice';
import redirectionsReducer from '@Redux/redirections/redirectionsSlice';
import menusReducer from '@Redux/menus/menusSlice';
import dashboardReducer from '@Redux/dashboard/dashboardSlice';
import pagesReducer from '@Redux/pages/pagesSlice';
import parametersReducer from '@Redux/parameters/parametersSlice';
import modulesReducer from '@Redux/modules/modulesSlice';
import themesReducer from '@Redux/themes/themesSlice';
import hooksReducer from '@Redux/hooks/hooksSlice';
import pageBlocksReducer from '@Redux/pageBlocks/pageBlocksSlice';
import languagesReducer from '@Redux/languages/languagesSlice';

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
    themes: themesReducer,
    hooks: hooksReducer,
    pageBlocks: pageBlocksReducer,
    languages: languagesReducer,
};

const store = configureStore({
    reducer: { ...reducer },
});

store.asyncReducers = { ...reducer };

store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(combineReducers(store.asyncReducers));
};

export default store;
