import React, { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getParametersAction, parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

const CHECK_RELOAD_PARAMETERS = ['core_debug_mode'];

export const ParametersMenu = () => {
    const { loading, parameters, error } = useSelector(parametersSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !parameters && !error) {
            dispatch(getParametersAction());
        }
    }, []);

    async function handleSubmit(values) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.parametersApi.editParameters(values);
        if (result.result) {
            NotificationManager.success('Les paramètres ont bien été modifiés.', 'Succès', Constant.REDIRECTION_TIME);

            CHECK_RELOAD_PARAMETERS.forEach((el) => {
                let oldValue = parameters?.find((it) => it.paramKey === el);
                let newValue = values?.parameters?.find((it) => it.paramKey === el);

                if (oldValue && newValue && oldValue.paramValue != newValue.paramValue) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            });

            dispatch(getParametersAction());

            navigate(Constant.PARAMETERS_BASE_PATH);
        } else {
            NotificationManager.error(result?.error?.message || 'Une erreur est survenue.', 'Erreur', Constant.REDIRECTION_TIME);
        }
    }

    if (!parameters) {
        return <></>;
    }

    return <Component.ParametersForm handleSubmit={handleSubmit} parameters={parameters} />;
};
