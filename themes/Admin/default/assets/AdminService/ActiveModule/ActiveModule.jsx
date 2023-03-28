import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActiveModuleContext } from '@/AdminService/ActiveModule/ActiveModuleContext';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';

import { loginFailure, profileSelector, setModulesLoaded } from '@Redux/profile/profileSlice';
import { useSelector } from 'react-redux';

export const ActiveModule = () => {
    const dispatch = useDispatch();
    const { connected, modulesLoaded } = useSelector(profileSelector);

    const getActiveModules = async () => {
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
    }, [connected]);

    if (null === modulesLoaded) {
        return <></>;
    }

    return <Component.App />;
};
