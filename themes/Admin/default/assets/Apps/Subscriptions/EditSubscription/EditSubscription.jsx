import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getSubscriptionsAction } from '@Apps/Subscriptions/redux/subscriptions/subscriptionsSlice';
import { subscriptionsInitialSchema, subscriptionsValidationSchema, subscriptionsForm } from '../SubscriptionsForm/SubscriptionsForm';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const subscriptionsEditCrud = {
    form: {
        title: "Modification d'un abonnement",
        initialSchema: subscriptionsInitialSchema,
        validationSchema: subscriptionsValidationSchema,
    },
    ...subscriptionsForm,
};

export const EditSubscription = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [subscription, setSubscription] = useState(null);
    const [eventsData, setEventsData] = useState(null);

    const getSubscription = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.subscriptionsApi.getOneSubscription(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.SUBSCRIPTIONS_BASE_PATH);
                return;
            }

            setSubscription(result.subscription);

            const defaultLanguageId = result?.event?.lang?.id;
            Api.eventsApi.getAllEvents({ lang: defaultLanguageId }).then((results) => setEventsData(results));
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.SUBSCRIPTIONS_BASE_PATH);
            return;
        }

        getSubscription(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.subscriptionsApi.editSubscription(id, values);
            if (result.result) {
                NotificationManager.success('La saison a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getSubscriptionsAction());
                navigate(Constant.SUBSCRIPTIONS_BASE_PATH);
            }
        });
    };

    if (!eventsData || !subscription) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={subscription} formCrud={Crud?.subscriptions?.edit} eventsList={eventsData?.events} />;
};
