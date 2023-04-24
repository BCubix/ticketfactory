import React, {useEffect, useState} from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { loginFailure } from "@/redux/profile/profileSlice";

import { getInfosAction } from "../../redux/infos/infosSlice";

export const EditInfo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [info, setInfo] = useState(null);

    async function getInfo (id) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.infosApi.getOneInfo(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

            navigate(Constant.INFOS_BASE_PATH);

            return;
        }

        setInfo(result.info);
    }

    useEffect(() => {
        if (!id) {
            navigate(Constant.INFOS_BASE_PATH);
            return;
        }

        getInfo(id);
    }, [id]);

    async function handleSubmit (values) {
        const check = await Api.authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await Api.infosApi.editInfo(id, values);

        if (result.result) {
            NotificationManager.success('L\'information a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getInfosAction());

            navigate(Constant.INFOS_BASE_PATH);
        }
    }

    if (!info) {
        return <></>;
    }

    return <Component.InfosForm handleSubmit={handleSubmit} initialValues={info} />
}

export default { EditInfo };