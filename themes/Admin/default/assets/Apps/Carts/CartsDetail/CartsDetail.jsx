import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CartsDetail = () => {
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
        <Component.CmtPageWrapper title={'Afficher'}>
            <Grid container spacing={4}>
                <Component.CustomerCartPart customer={cart?.customer} />
                <Component.CartPart cartRows={cart?.cartRows} />
            </Grid>
        </Component.CmtPageWrapper>
    );
};
