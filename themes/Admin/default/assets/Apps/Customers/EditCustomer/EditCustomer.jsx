import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getCustomersAction } from '@Redux/customers/customersSlice';

export const EditCustomer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    const getCustomer = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.customersApi.getOneCustomer(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.CUSTOMERS_BASE_PATH);
                return;
            }

            setCustomer(result.customer);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.CUSTOMERS_BASE_PATH);
            return;
        }

        getCustomer(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.customersApi.editCustomer(id, values);
            if (result.result) {
                NotificationManager.success('Le client a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getCustomersAction());
                navigate(Constant.CUSTOMERS_BASE_PATH);
            }
        });
    };

    if (!customer) {
        return <></>;
    }

    return <Component.CustomersForm handleSubmit={handleSubmit} initialValues={customer} />;
};
