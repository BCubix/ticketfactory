import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userProfileSlice from '@Apps/Auth/redux/userProfile/userProfileSlice';

const reducer = {
    userProfile: userProfileSlice,
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
