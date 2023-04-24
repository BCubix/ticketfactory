import React from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getCustomersAction } from '@Redux/customers/customersSlice';

export const CreateCustomer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.customersApi.createCustomer(values);
            if (result.result) {
                NotificationManager.success('Le client a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getCustomersAction());
                navigate(Constant.CUSTOMERS_BASE_PATH);
            }
        });
    };

    return <Component.CustomersForm handleSubmit={handleSubmit} />;
};
