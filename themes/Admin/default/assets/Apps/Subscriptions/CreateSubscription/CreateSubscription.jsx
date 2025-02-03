import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getSubscriptionsAction } from '@Apps/Subscriptions/redux/subscriptions/subscriptionsSlice';
import { subscriptionsInitialSchema, subscriptionsValidationSchema, subscriptionsForm } from '../SubscriptionsForm/SubscriptionsForm';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

import { Crud } from '@/AdminService/Crud';
import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const subscriptionsCreateCrud = {
    form: {
        title: "Création d'un abonnement",
        initialSchema: subscriptionsInitialSchema,
        validationSchema: subscriptionsValidationSchema,
    },
    ...subscriptionsForm,
};

export const CreateSubscription = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const [initialValues, setInitialValues] = useState(null);
    const [eventsData, setEventsData] = useState(null);

    const [queryParameters] = useSearchParams();
    const subscriptionId = queryParameters.get('subscriptionId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            if (!subscriptionId || !languageId) {
                return;
            }

            let subscription = await Api.subscriptionsApi.getTranslated(subscriptionId, languageId);
            if (!subscription?.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.SUBSCRIPTIONS_BASE_PATH);
                return;
            }

            setInitialValues(subscription.subscription);
        });
    }, []);

    useEffect(() => {
        const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;
        if (!defaultLanguageId) {
            return;
        }

        Api.eventsApi.getAllEvents({ lang: defaultLanguageId }).then((results) => setEventsData(results));
    }, [languagesData?.languages]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.subscriptionsApi.createSubscription(values);
            if (result.result) {
                NotificationManager.success("L'abonnement a bien été créée.", 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getSubscriptionsAction());
                navigate(Constant.SUBSCRIPTIONS_BASE_PATH);
            }
        });
    };

    if (!eventsData || (subscriptionId && !initialValues)) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} translateInitialValues={initialValues} formCrud={Crud?.subscriptions?.add} eventsList={eventsData?.events} />;
};
