import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { getPageBlockTypesAction } from '@Apps/PageBlockTypes/redux/pageBlockTypes/pageBlockTypesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { pageBlockTypesForm, pageBlockTypesInitialSchema, pageBlockTypesValidationSchema } from '../PageBlockTypesForm/PageBlockTypesForm';

export const pageBlockTypesEditCrud = {
    form: {
        title: "Modification d'un type de bloc",
        initialSchema: pageBlockTypesInitialSchema,
        validationSchema: pageBlockTypesValidationSchema,
        formProps: {
            validateOnChange: false,
            validateOnBlur: true,
        },
    },
    ...pageBlockTypesForm,
};

export const EditPageBlockType = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageBlockType, setPageBlockType] = useState(null);

    const getPageBlockType = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlockTypesApi.getOnePageBlockType(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PAGE_BLOCK_TYPES_BASE_PATH);
                return;
            }

            setPageBlockType(result.pageBlockType);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.PAGE_BLOCK_TYPES_BASE_PATH);
            return;
        }

        getPageBlockType(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlockTypesApi.editPageBlockType(id, values);

            if (result.result) {
                NotificationManager.success('Le type de bloc a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getPageBlockTypesAction());
                navigate(Constant.PAGE_BLOCK_TYPES_BASE_PATH);
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    const getPageBlockTypesModules = useMemo(() => {
        return Crud.pageBlockTypes.edit.pageBlockTypeFields;
    }, []);

    if (!pageBlockType) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={pageBlockType}
            getPageBlockTypesModules={getPageBlockTypesModules}
            formCrud={Crud?.pageBlockTypes?.edit}
        />
    );
};
