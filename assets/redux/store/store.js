import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../profile/profileSlice';
import usersReducer from '../users/usersSlice';
import eventsReducer from '../events/eventsSlice';

export default configureStore({
    reducer: {
        profile: profileReducer,
        users: usersReducer,
        events: eventsReducer,
    },
});
