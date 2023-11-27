import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getVouchersAction } from '@Apps/Vouchers/redux/vouchers/vouchersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { vouchersInitialSchema, vouchersValidationSchema, vouchersForm } from '@Apps/Vouchers/VouchersForm/VouchersForm';
import { Crud } from '@/AdminService/Crud';

export const vouchersCreateCrud = {
    form: {
        title: "Création d'un coupon de réduction",
        initialSchema: vouchersInitialSchema,
        validationSchema: vouchersValidationSchema,
    },
    ...vouchersForm,
};

export const CreateVoucher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const categories = await Api.categoriesApi.getCategories();
            if (categories.result) {
                setCategories(categories?.categories);
            }
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.vouchersApi.createVoucher(values);
            if (result.result) {
                NotificationManager.success('La réduction a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getVouchersAction());
                navigate(Constant.VOUCHERS_BASE_PATH);
            }
        });
    };

    if (categories.length < 1) {
        return <></>;
    }

    return <Component.CmtCrudForm handleSubmit={handleSubmit} eventCategoriesList={categories} formCrud={Crud?.vouchers?.add} />;
};
