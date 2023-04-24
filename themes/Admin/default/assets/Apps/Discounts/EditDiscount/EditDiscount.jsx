import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getDiscountsAction } from '@Redux/discounts/discountsSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

export const EditDiscount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [discount, setDiscount] = useState(null);

    const getDiscount = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.discountsApi.getOneDiscount(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.DISCOUNTS_BASE_PATH);
                return;
            }

            setDiscount(result.user);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.DISCOUNTS_BASE_PATH);
            return;
        }

        getDiscount(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.discountsApi.editDiscount(id, values);
            if (result.result) {
                NotificationManager.success('La réduction a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getDiscountsAction());
                navigate(Constant.DISCOUNTS_BASE_PATH);
            }
        });
    };

    if (!discount) {
        return <></>;
    }

    return <Component.DiscountsForm handleSubmit={handleSubmit} initialValues={discount} />;
};
