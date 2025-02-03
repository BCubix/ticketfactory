import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Api } from '../Api';
import { ActiveModule } from '@/AdminService/ActiveModule/ActiveModule';
import { loginFailure } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { userProfileInitAction, userProfileSelector } from '@Apps/Auth/redux/userProfile/userProfileSlice';
import { getUserRoles } from '@Services/utils/getUserRoles';

const FUNCTIONS_LIST = ['initConstant', 'initComponent', 'initApi', 'initAuthenticatedRoutes', 'initNonAuthenticatedRoutes', 'initMenu', 'initReducer', 'initTab', 'initCrud'];

export const ActiveApp = () => {
    const [loaded, setLoaded] = useState(null);
    const [loading, setLoading] = useState(false);
    const { connected, user, loading: userLoading } = useSelector(userProfileSelector);
    const dispatch = useDispatch();

    const getList = useMemo(() => {
        return require.context(`@Apps`, true, /^\.\/\w+\/index.js$/);
    }, []);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const initApp = async () => {
        const list = getList;
        const listKeys = list.keys();

        FUNCTIONS_LIST.forEach((functionName) => {
            listKeys.map(async (item) => {
                const func = list(item)[functionName];
                if (func && typeof func === 'function') {
                    func({ dispatch, userRoles });
                }
            });
        });
    };

    const initAppDefaultFunctions = async () => {
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
                await func({ parameters: parametersData?.parameters, dispatch, userRoles });
            }
        });
    };

    const loadApp = async () => {
        setLoading(true);

        await initApp();
        await initAppDefaultFunctions();

        setLoaded(true);
        setLoading(false);
    };

    useEffect(() => {
        if (connected === null && !userLoading) {
            dispatch(userProfileInitAction());
        }
    }, []);

    useEffect(() => {
        if (connected === null || loaded || loading) {
            return;
        }

        loadApp();
    }, [connected]);

    if (loaded === null) {
        return <></>;
    }

    return <ActiveModule loaded={loaded} />;
};
