import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';
import { getVouchersAction } from '@Apps/Vouchers/redux/vouchers/vouchersSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { vouchersInitialSchema, vouchersValidationSchema, vouchersForm } from '@Apps/Vouchers/VouchersForm/VouchersForm';
import { Crud } from '@/AdminService/Crud';

export const vouchersEditCrud = {
    form: {
        title: "Modification d'un coupon de réduction",
        initialSchema: vouchersInitialSchema,
        validationSchema: vouchersValidationSchema,
    },
    ...vouchersForm,
};

export const EditVoucher = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);
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

    const getVoucher = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.vouchersApi.getOneVoucher(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.VOUCHERS_BASE_PATH);
                return;
            }

            setVoucher(result.voucher);
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.VOUCHERS_BASE_PATH);
            return;
        }

        getVoucher(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.vouchersApi.editVoucher(id, values);
            if (result.result) {
                NotificationManager.success('La réduction a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getVouchersAction());
                navigate(Constant.VOUCHERS_BASE_PATH);
            }
        });
    };

    if (!voucher || categories.length < 1) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={voucher}
            eventCategoriesList={eventCategories}
            productCategories={productCategories}
            formCrud={Crud?.vouchers?.edit}
        />
    );
};
