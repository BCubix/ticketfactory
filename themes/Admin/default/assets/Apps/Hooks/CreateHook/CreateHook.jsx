import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getPagesAction } from '@Redux/pages/pagesSlice';
import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const CreateHook = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modulesActive, setModulesActive] = useState(null);

    useEffect(() => {
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
                NotificationManager.success('La page a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPagesAction());
                navigate(Constant.PAGES_BASE_PATH);
            }
        });
    }

    if (null === modulesActive) {
        return <></>;
    }

    return <Component.HooksForm handleSubmit={handleSubmit} modulesActive={modulesActive} />;
}

