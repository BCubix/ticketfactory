import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ParametersModuleMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [module, setModule] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.modulesApi.getOneModule(id);
            if (!result?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.MODULES_BASE_PATH);
                return;
            }

            console.log(result);

            setModule(result?.module);
        });
    }, []);

    if (id && !module) {
        return <></>;
    }

    return <Component.ParametersMenu module={module} moduleParameters filter={`module_${module ? `${module.name}_` : ''}`} />;
};
