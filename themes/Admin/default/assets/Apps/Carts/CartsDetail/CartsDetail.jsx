import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';

export const cartsDetailCrud = {
    title: 'Afficher',
    components: [
        { component: ({ cart, ...props }) => <Component.CustomerCartPart customer={cart?.customer} cart={cart} {...props} /> },
        { component: ({ cart, ...props }) => <Component.OrderCartPart order={cart?.linkedOrder} cart={cart} {...props} /> },
        { component: ({ cart, ...props }) => <Component.CartPart cart={cart} {...props} /> },
    ],
};

export const CartsDetail = ({ ...props }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [cart, setCart] = useState(null);

    const getCart = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.cartsApi.getOneCart(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CARTS_BASE_PATH);
                return;
            }

            setCart(result.cart);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CARTS_BASE_PATH);
            return;
        }

        getCart(id);
    }, [id]);

    if (!cart) {
        return <></>;
    }

    return (
        <Component.CmtPageWrapper title={Crud?.carts?.detail?.title}>
            <Grid container spacing={4}>
                <Component.CmtDisplayComponents list={Crud?.carts?.detail?.components} detailCrud={Crud?.carts?.detail} cart={cart} {...props} />
            </Grid>
        </Component.CmtPageWrapper>
    );
};
