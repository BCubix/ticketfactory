import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActiveModule } from '@/AdminService/ActiveModule/ActiveModule';
import { Api } from '../Api';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

const FUNCTIONS_LIST = ['initConstant', 'initComponent', 'initApi', 'initAuthenticatedRoutes', 'initNonAuthenticatedRoutes', 'initMenu', 'initReducer', 'initTab', 'initCrud'];

export const ActiveApp = () => {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();

    const initApp = async () => {
        const list = require.context(`@Apps`, true, /^\.\/\w+\/index.js$/);
        const listKeys = list.keys();

        FUNCTIONS_LIST.forEach((functionName) => {
            listKeys.map(async (item) => {
                const func = list(item)[functionName];
                if (func && typeof func === 'function') {
                    func({ dispatch });
                }
            });
        });

        const check = await Api.authApi.checkIsAuth();
        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            setLoaded(true);

            return;
        }

        const parametersData = await Api.parametersApi.getParameters();

        listKeys.map(async (item) => {
            const func = list(item)?.default;
            if (func) {
                func({ parameters: parametersData?.parameters });
            }
        });

        setLoaded(true);
    };

    useEffect(() => {
        initApp();
    }, []);

    if (!loaded) {
        return <></>;
    }

    return <ActiveModule />;
};
