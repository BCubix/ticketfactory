import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getOrderStatusAction } from '@Apps/OrderStatus/redux/orderStatus/orderStatusSlice';
import { orderStatusInitialSchema, orderStatusValidationSchema, orderStatusForm } from '../OrderStatusForm/OrderStatusForm';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const orderStatusEditCrud = {
    form: {
        title: "Modification d'un état de commande",
        initialSchema: orderStatusInitialSchema,
        validationSchema: orderStatusValidationSchema,
    },
    ...orderStatusForm,
};

export const EditOrderStatus = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [orderStatus, setOrderStatus] = useState(null);

    const getOrderStatus = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.orderStatusApi.getOneOrderStatus(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.ORDER_STATUS_BASE_PATH);
                return;
            }

            setOrderStatus(result.orderStatus);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.ORDER_STATUS_BASE_PATH);
            return;
        }

        getOrderStatus(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.orderStatusApi.editOrderStatus(id, values);
            if (result.result) {
                NotificationManager.success('La saison a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getOrderStatusAction());
                navigate(Constant.ORDER_STATUS_BASE_PATH);
            }
        });
    };

    if (!orderStatus) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} initialValues={orderStatus} formCrud={Crud?.orderStatus?.edit} />;
};
