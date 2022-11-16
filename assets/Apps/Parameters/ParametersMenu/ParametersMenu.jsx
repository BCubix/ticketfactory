import React, { useEffect } from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getParametersAction, parametersSelector } from "@Redux/parameters/parametersSlice";
import { loginFailure } from "@Redux/profile/profileSlice";

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

            dispatch(getParametersAction());

            navigate(Constant.PARAMETERS_BASE_PATH);
        }
    }

    if (!parameters) {
        return <></>;
    }

    return (
        <Component.ParametersForm
            handleSubmit={handleSubmit}
            parameters={parameters}
        />
    );
}
