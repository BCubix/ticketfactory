import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getFeaturesAction } from '@Apps/Features/redux/features/featuresSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { featuresInitialSchema, featuresValidationSchema, featuresForm } from '@Apps/Features/FeaturesForm/FeaturesForm.jsx';

export const featuresCreateCrud = {
    form: {
        title: "Creation d'un attribut",
        initialSchema: featuresInitialSchema,
        validationSchema: featuresValidationSchema,
    },
    ...featuresForm,
};

export const CreateFeature = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const featureId = queryParameters.get('featureId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        if (!featureId || !languageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            let feature = await Api.featuresApi.getTranslated(featureId, languageId);
            if (!feature?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.FEATURES_BASE_PATH);
                return;
            }

            setInitialValues(feature.feature);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.featuresApi.createFeature(values);
            if (result.result) {
                NotificationManager.success('La salle a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getFeaturesAction());
                navigate(Constant.FEATURES_BASE_PATH);
            }
        });
    };

    if (featureId && !initialValues) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} translateInitialValues={initialValues} formCrud={Crud?.features?.add} />;
};
