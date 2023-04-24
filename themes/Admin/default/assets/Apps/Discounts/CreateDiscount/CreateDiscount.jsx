import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getDiscountsAction } from '@Redux/discounts/discountsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const CreateDiscount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.discountsApi.createDiscount(values);
            if (result.result) {
                NotificationManager.success('La réduction a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getDiscountsAction());
                navigate(Constant.DISCOUNTS_BASE_PATH);
            }
        });
    };

    return <Component.DiscountsForm handleSubmit={handleSubmit} />;
};
