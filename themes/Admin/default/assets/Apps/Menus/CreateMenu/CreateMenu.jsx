import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getMenusAction } from '@Apps/Menus/redux/menus/menusSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import * as Yup from 'yup';
import { Crud } from '@/AdminService/Crud';

export const menusCreateInitialSchema = {
    name: (initValues) => initValues?.name || '',
    lang: (initValues) => initValues?.lang?.id || '',
    menuType: 'none',
    languageGroup: (initValues) => initValues?.languageGroup || '',
};

export const menusCreateValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du menu.'),
};

export const menusCreateForm = {
    form: {
        title: "Création d'un menu",
        initialSchema: menusCreateInitialSchema,
        validationSchema: menusCreateValidationSchema,
    },
    submitLine: {
        activeInput: true,
        activeLabel: 'Menu actif ?',
    },
    api: {
        dataFields: {
            name: { type: 'string' },
            menuType: { type: 'string' },
            active: { type: 'boolean' },
            noFollow: { type: 'boolean' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'season',
            label: 'Saison',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12 },
                            input: {
                                name: 'name',
                                label: 'Nom du menu',
                                inputType: 'textField',
                                required: true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const CreateMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const menuId = queryParameters.get('menuId');
    const languageId = queryParameters.get('languageId');

    const createMenu = (values) => {
        return apiMiddleware(dispatch, async () => {
            const result = await Api.menusApi.createMenu(values);
            if (result.result) {
                NotificationManager.success('Le menu a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getMenusAction());
                navigate(Constant.MENUS_BASE_PATH);
            }
        });
    };

    useEffect(() => {
        if (!menuId || !languageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            let menu = await Api.menusApi.getTranslated(menuId, languageId);
            if (!menu?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.MENUS_BASE_PATH);
                return;
            }

            setInitialValues(menu.menu);
        });
    }, []);

    const menusSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du menu.'),
    });

    if (menuId && !initialValues) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={createMenu} translateInitialValues={initialValues} formCrud={Crud?.menus?.add} />;
};
