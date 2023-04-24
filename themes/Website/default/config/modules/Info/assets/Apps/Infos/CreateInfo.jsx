import React from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from "@/redux/profile/profileSlice";

import { getInfosAction } from "../../redux/infos/infosSlice";

export const CreateInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(values) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.infosApi.createInfo(values);

        if (result.result) {
            NotificationManager.success('L\'information a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getInfosAction());

            navigate(Constant.INFOS_BASE_PATH);
        }
    }

    return <Component.InfosForm handleSubmit={handleSubmit} />;
}

export default { CreateInfo };