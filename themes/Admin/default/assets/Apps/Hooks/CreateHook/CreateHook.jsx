import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getHooksAction, hooksSelector } from "@Redux/hooks/hooksSlice";
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const CreateHook = () => {
    const { loading, hooks, error } = useSelector(hooksSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modulesActive, setModulesActive] = useState(null);

    useEffect(() => {
        if (!loading && !hooks && !error) {
            dispatch(getHooksAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.modulesApi.getModulesActive();
            if (result.result) {
                setModulesActive(result.modules);
            }
        });
    }, []);

    const handleSubmit = (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.hooksApi.createHook(values);

            if (result.result) {
                NotificationManager.success('Le hook a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getHooksAction());
                navigate(Constant.HOOKS_BASE_PATH);
            }
        });
    }

    if (null === modulesActive || null === hooks) {
        return <></>;
    }

    return <Component.HooksForm handleSubmit={handleSubmit} modulesActive={modulesActive} hooksList={hooks}/>;
}

