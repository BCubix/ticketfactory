import { combineReducers, configureStore } from '@reduxjs/toolkit';

import profileSlice from '@Apps/Auth/redux/profile/profileSlice';

const reducer = {
    profile: profileSlice,
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
