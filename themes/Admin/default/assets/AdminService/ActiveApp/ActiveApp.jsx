import React, { useEffect, useState } from 'react';

import { ActiveModule } from '@/AdminService/ActiveModule/ActiveModule';

const FUNCTIONS_LIST = ['initConstant', 'initComponent', 'initApi', 'initAuthenticatedRoutes', 'initNonAuthenticatedRoutes', 'initMenu', 'initReducer', 'default'];

export const ActiveApp = () => {
    const [appLoaded, setAppLoaded] = useState(false);

    const initApp = () => {
        const list = require.context(`@Apps`, true, /^\.\/\w+\/index.js$/);
        const listKeys = list.keys();

        FUNCTIONS_LIST.forEach((functionName) => {
            listKeys.map((item) => {
                const func = list(item)[functionName];

                if (func && typeof func === 'function') {
                    func();
                }
            });
        });

        setAppLoaded(true);
    };

    useEffect(() => {
        initApp();
    }, []);

    if (!appLoaded) {
        return <></>;
    }

    return <ActiveModule />;
};
