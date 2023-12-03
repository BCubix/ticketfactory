import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getFeaturesAction } from '@Apps/Features/redux/features/featuresSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { featuresInitialSchema, featuresValidationSchema, featuresForm } from '@Apps/Features/FeaturesForm/FeaturesForm';
import { Crud } from '@/AdminService/Crud';

export const featuresEditCrud = {
    form: {
        title: "Modification d'un attribut",
        initialSchema: featuresInitialSchema,
        validationSchema: featuresValidationSchema,
    },
    ...featuresForm,
};

export const EditFeature = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [feature, setFeature] = useState(null);
    const [featureCategoriesData, setFeatureCategoriesData] = useState(null);

    const getFeature = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.featuresApi.getOneFeature(id);

            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);

                navigate(Constant.FEATURES_BASE_PATH);

                return;
            }

            setFeature(result.feature);

            Api.featureCategoriesApi.getFeatureCategories({ lang: result?.feature?.lang?.id }).then((results) => setFeatureCategoriesData(results));

        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.FEATURES_BASE_PATH);
            return;
        }

        getFeature(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.featuresApi.editFeature(id, values);

            if (result.result) {
                NotificationManager.success('La salle a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getFeaturesAction());
                navigate(Constant.FEATURES_BASE_PATH);
            }
        });
    };

    if (!feature) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={feature} featureCategoriesList={featureCategoriesData?.featureCategories} formCrud={Crud?.features?.edit} />;
};
