import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ActiveModuleContext } from '@/AdminService/ActiveModule/ActiveModuleContext';
import { loginFailure, userProfileSelector, setModulesLoaded } from '@Apps/Auth/redux/userProfile/userProfileSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { getUserRoles } from '@Services/utils/getUserRoles';

export const ActiveModule = ({ loaded }) => {
    const dispatch = useDispatch();
    const { connected, user, modulesLoaded } = useSelector(userProfileSelector);

    const userRoles = useMemo(() => {
        return getUserRoles(user);
    }, [user]);

    const getActiveModules = async () => {
        if (!loaded) {
            dispatch(setModulesLoaded({ modulesLoaded: false }));
            return;
        }

        const check = await Api.authApi.checkIsAuth();
        if (check.result) {
            const result = await Api.modulesApi.getModulesActive();
            if (result.result) {
                ActiveModuleContext(result.modules, userRoles);
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
