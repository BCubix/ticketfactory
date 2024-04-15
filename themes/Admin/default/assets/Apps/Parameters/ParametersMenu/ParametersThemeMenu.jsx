import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const ParametersThemeMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const result = await Api.themesApi.getOneTheme(id);
            if (!result?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.THEMES_BASE_PATH);
                return;
            }

            setTheme(result?.theme);
        });
    }, []);

    if (id && !theme) {
        return <></>;
    }

    return <Component.ParametersMenu theme={theme} themeParameters filter={`theme_${theme ? `${theme.name}_` : ''}`} />;
};
