import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducer = {};

const store = configureStore({
    reducer: { ...reducer },
});

store.asyncReducers = { ...reducer };

store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(combineReducers(store.asyncReducers));
};

export default store;
