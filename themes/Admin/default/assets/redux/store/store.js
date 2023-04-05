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
import pageTypesReducer from '@Redux/pageTypes/pageTypesSlice';
import contentsReducer from '@Redux/contents/contentsSlice';
import contactRequestsReducer from '@Redux/contactRequests/contactRequestsSlice';
import redirectionsReducer from '@Redux/redirections/redirectionsSlice';
import menusReducer from '@Redux/menus/menusSlice';
import menusListDataReducer from '@Redux/menus/menusListDataSlice';
import dashboardReducer from '@Redux/dashboard/dashboardSlice';
import pagesReducer from '@Redux/pages/pagesSlice';
import parametersReducer from '@Redux/parameters/parametersSlice';
import modulesReducer from '@Redux/modules/modulesSlice';
import themesReducer from '@Redux/themes/themesSlice';
import hooksReducer from '@Redux/hooks/hooksSlice';
import pageBlocksReducer from '@Redux/pageBlocks/pageBlocksSlice';
import languagesReducer from '@Redux/languages/languagesSlice';
import mediaCategoriesReducer from '@Redux/mediaCategories/mediaCategoriesSlice';

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
    pageTypes: pageTypesReducer,
    contents: contentsReducer,
    contactRequests: contactRequestsReducer,
    redirections: redirectionsReducer,
    menus: menusReducer,
    menusListData: menusListDataReducer,
    dashboard: dashboardReducer,
    pages: pagesReducer,
    parameters: parametersReducer,
    modules: modulesReducer,
    themes: themesReducer,
    hooks: hooksReducer,
    pageBlocks: pageBlocksReducer,
    languages: languagesReducer,
    mediaCategories: mediaCategoriesReducer,
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
