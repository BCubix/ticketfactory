import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../profile/profileSlice';
import usersReducer from '../users/usersSlice';

export default configureStore({
    reducer: {
        profile: profileReducer,
        users: usersReducer,
    },
});
