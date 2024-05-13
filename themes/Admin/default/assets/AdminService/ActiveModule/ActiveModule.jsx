import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActiveModuleContext } from '@/AdminService/ActiveModule/ActiveModuleContext';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';

import { loginFailure, profileSelector, setModulesLoaded } from '@Apps/Auth/redux/profile/profileSlice';
import { useSelector } from 'react-redux';

export const ActiveModule = ({ loaded }) => {
    const dispatch = useDispatch();
    const { connected, modulesLoaded } = useSelector(profileSelector);

    const getActiveModules = async () => {
        if (!loaded) {
            dispatch(setModulesLoaded({ modulesLoaded: false }));
            return;
        }

        const check = await Api.authApi.checkIsAuth();
        if (check.result) {
            const result = await Api.modulesApi.getModulesActive();
            if (result.result) {
                ActiveModuleContext(result.modules);
                dispatch(setModulesLoaded({ modulesLoaded: true }));
            }
        } else {
            dispatch(loginFailure({ error: check.error }));
            dispatch(setModulesLoaded({ modulesLoaded: false }));
        }
    };

    useEffect(() => {
        if (modulesLoaded) {
            return;
        }

        getActiveModules();
    }, [connected, loaded]);

    if (null === modulesLoaded) {
        return <></>;
    }

    return <Component.App />;
};
