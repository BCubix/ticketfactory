import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Grid } from '@mui/material';

export const OrdersDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    const getOrder = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.ordersApi.getOneOrder(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.ORDERS_BASE_PATH);
                return;
            }

            setOrder(result.order);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.ORDERS_BASE_PATH);
            return;
        }

        getOrder(id);
    }, [id]);

    if (!order) {
        return <></>;
    }

    return (
        <Component.CmtPageWrapper title={'Afficher'}>
            <Grid container spacing={4}>
                <Component.CustomerOrderPart customer={order?.customer} />
                <Component.OrderPart order={order} />
                <Component.CartOrderPart cart={order?.cart} />
            </Grid>
        </Component.CmtPageWrapper>
    );
};
