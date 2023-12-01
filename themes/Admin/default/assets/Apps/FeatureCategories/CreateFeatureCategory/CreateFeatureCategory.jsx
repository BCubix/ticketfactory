import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { featureCategoriesInitialSchema, featureCategoriesValidationSchema, featureCategoriesForm } from '@Apps/FeatureCategories/FeatureCategoriesForm/FeatureCategoriesForm.jsx';
import { getFeatureCategoriesAction } from '@Apps/FeatureCategories/redux/featureCategories/featureCategoriesSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { Crud } from '@/AdminService/Crud';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const featureCategoriesCreateCrud = {
    form: {
        title: "Creation d'une catégorie d'attribut",
        initialSchema: featureCategoriesInitialSchema,
        validationSchema: featureCategoriesValidationSchema,
    },
    ...featureCategoriesForm,
};

export const CreateFeatureCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const featureCategoryId = queryParameters.get('featureCategoryId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        if (!featureCategoryId || !languageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            let featureCategory = await Api.featureCategoriesApi.getTranslated(featureCategoryId, languageId);
            if (!featureCategory?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.FEATURE_CATEGORIES_BASE_PATH);
                return;
            }

            setInitialValues(featureCategory.featureCategory);
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.featureCategoriesApi.createFeatureCategory(values);
            if (result.result) {
                NotificationManager.success('La catégorie a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getFeatureCategoriesAction());
                navigate(Constant.FEATURE_CATEGORIES_BASE_PATH);
            }
        });
    };

    if (featureCategoryId && !initialValues) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} translateInitialValues={initialValues} formCrud={Crud?.featureCategories?.add} />;
};
