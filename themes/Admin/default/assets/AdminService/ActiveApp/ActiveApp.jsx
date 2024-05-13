import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ActiveModule } from '@/AdminService/ActiveModule/ActiveModule';
import { Api } from '../Api';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';
import { profileSelector } from '../../Apps/Auth/redux/profile/profileSlice';

const FUNCTIONS_LIST = ['initConstant', 'initComponent', 'initApi', 'initAuthenticatedRoutes', 'initNonAuthenticatedRoutes', 'initMenu', 'initReducer', 'initTab', 'initCrud'];

export const ActiveApp = () => {
    const [loaded, setLoaded] = useState(null);
    const [loading, setLoading] = useState(false);
    const { connected } = useSelector(profileSelector);
    const dispatch = useDispatch();

    const getList = useMemo(() => {
        return require.context(`@Apps`, true, /^\.\/\w+\/index.js$/);
    }, []);

    const initApp = async () => {
        const list = getList;
        const listKeys = list.keys();

        FUNCTIONS_LIST.forEach((functionName) => {
            listKeys.map(async (item) => {
                const func = list(item)[functionName];
                if (func && typeof func === 'function') {
                    func({ dispatch });
                }
            });
        });

        initAppDefaultFunctions();
    };

    const initAppDefaultFunctions = async () => {
        if (loaded || loading) {
            return;
        }

        setLoading(true);

        const check = await Api.authApi.checkIsAuth();
        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));
            setLoading(false);
            setLoaded(false);
            return;
        }

        const parametersData = await Api.parametersApi.getParameters();

        const list = getList;
        const listKeys = list.keys();

        listKeys.map(async (item) => {
            const func = list(item)?.default;
            if (func) {
                func({ parameters: parametersData?.parameters });
            }
        });

        setLoading(false);
        setLoaded(true);
    };

    useEffect(() => {
        initApp();
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        initAppDefaultFunctions();
    }, [connected]);

    if (loaded === null) {
        return <></>;
    }

    return <ActiveModule loaded={loaded} />;
};
