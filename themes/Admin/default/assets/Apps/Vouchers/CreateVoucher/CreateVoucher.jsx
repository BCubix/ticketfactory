import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

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
    const languagesData = useSelector(languagesSelector);
    const [eventCategories, setEventCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([]);

    useEffect(() => {
        const defaultLanguageId = languagesData?.languages?.find((el) => el.isDefault)?.id;

        apiMiddleware(dispatch, async () => {
            const [eventCategoriesResult, productCategoriesResult] = await Promise.all([
                Api.categoriesApi.getCategories({ lang: defaultLanguageId }),
                Api.productCategoriesApi.getProductCategories({ lang: defaultLanguageId }),
            ]);

            if (!eventCategoriesResult.result || !productCategoriesResult.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.VOUCHERS_BASE_PATH);
                return;
            }

            setEventCategories(eventCategoriesResult?.categories);
            setProductCategories(productCategoriesResult?.productCategories);
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

    return <Component.CmtCrudForm handleSubmit={handleSubmit} eventCategoriesList={eventCategories} productCategories={productCategories} formCrud={Crud?.vouchers?.add} />;
};
