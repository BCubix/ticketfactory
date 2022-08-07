import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../profile/profileSlice';
import usersReducer from '../users/usersSlice';
import eventsReducer from '../events/eventsSlice';
import categoriesReducer from '../categories/categoriesSlice';
import roomsReducer from '../rooms/roomsSlice';
import seasonsReducer from '../seasons/seasonsSlice';
import tagsReducer from '../tags/tagsSlice';

export default configureStore({
    reducer: {
        profile: profileReducer,
        users: usersReducer,
        events: eventsReducer,
        categories: categoriesReducer,
        rooms: roomsReducer,
        seasons: seasonsReducer,
        tags: tagsReducer,
    },
});
