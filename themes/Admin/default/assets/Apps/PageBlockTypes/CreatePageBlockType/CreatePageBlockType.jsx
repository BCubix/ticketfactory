import React, { useMemo } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { pageBlockTypesForm, pageBlockTypesInitialSchema, pageBlockTypesValidationSchema } from '../PageBlockTypesForm/PageBlockTypesForm';
import { getPageBlockTypesAction } from '../redux/pageBlockTypes/pageBlockTypesSlice';

export const pageBlockTypesCreateCrud = {
    form: {
        title: "Création d'un type de bloc",
        initialSchema: pageBlockTypesInitialSchema,
        validationSchema: pageBlockTypesValidationSchema,
        formProps: {
            validateOnChange: false,
            validateOnBlur: true,
        },
    },
    ...pageBlockTypesForm,
};

export const CreatePageBlockType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlockTypesApi.createPageBlockType(values);

            if (result.result) {
                NotificationManager.success('Le type de bloc a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPageBlockTypesAction());
                navigate(Constant.PAGE_BLOCK_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const getPageBlockTypesModules = useMemo(() => {
        return Crud.pageBlockTypes.add.pageBlockTypeFields;
    }, []);

    return <Component.CmtCrudForm handleSubmit={handleSubmit} getPageBlockTypesModules={getPageBlockTypesModules} formCrud={Crud?.pageBlockTypes?.add} />;
};
