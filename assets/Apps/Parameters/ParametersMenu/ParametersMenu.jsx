import React from 'react';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";

import authApi from "@Services/api/authApi";
import parametersApi from "@Services/api/parametersApi";
import {loginFailure} from "@Redux/profile/profileSlice";
import {getParametersAction, parametersSelector} from "@Redux/parameters/parametersSlice";

import {PARAMETERS_BASE_PATH, REDIRECTION_TIME} from "@/Constant";
import { ParametersForm } from "@Apps/Parameters/ParametersForm/ParametersForm";

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
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await parametersApi.editParameters(values);
        if (result.result) {
            NotificationManager.success('Les paramètres ont bien été modifiés.', 'Succès', REDIRECTION_TIME);

            dispatch(getParametersAction());

            navigate(PARAMETERS_BASE_PATH);
        }
    }

    if (!parameters) {
        return <></>;
    }

    return (
        <ParametersForm
            handleSubmit={handleSubmit}
            parameters={parameters}
        />
    );
}
