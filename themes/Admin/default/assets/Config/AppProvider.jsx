import React from 'react';
import { sidebarConfig } from './configValues/sidebarConfig';

const APP_ACTIONS = {
    SIDEBAR_STYLE: 'sidebarStyle',
    SMALL_MEDIA: 'smallMedia',
};

const init = (initialValue) => {
    return {
        isSmallMedia: initialValue.isSmallMedia,
        sidebar: initialValue.sidebar,
    };
};

export const AppContext = React.createContext({});

const appReducer = (state, action) => {
    switch (action.type) {
        case APP_ACTIONS.SIDEBAR_STYLE:
            return {
                ...state,
                sidebar: action.payload,
            };
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [app, setApp] = React.useReducer(
        appReducer,
        {
            isSmallMedia: false,
            sidebar: sidebarConfig,
        },
        init
    );

    const setSideBar = React.useCallback(
        (value) => {
            setApp({ type: APP_ACTIONS.SIDEBAR_STYLE, payload: value });
        },
        [setApp]
    );

    const setSmallMedia = React.useCallback(
        (value) => {
            setApp({ type: APP_ACTIONS.SMALL_MEDIA, payload: value });
        },
        [setApp]
    );

    const contextValue = React.useMemo(() => ({
        ...app,
        setSideBar,
        setSmallMedia,
    }));

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
