import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { getProductsAction } from '@Apps/Products/redux/products/productsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { productsInitialSchema, productsValidationSchema, productsForm } from '../ProductsForm/ProductsForm';

export const productsCreateCrud = {
    form: {
        title: "Creation d'un produit",
        initialSchema: productsInitialSchema,
        validationSchema: productsValidationSchema,
    },
    ...productsForm,
};

export const CreateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const languagesData = useSelector(languagesSelector);
    const [productCategoriesData, setProductCategoriesData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const productId = queryParameters.get('productId');
    const languageId = queryParameters.get('languageId');

    useEffect(() => {
        if (!languageId && !languagesData?.languages) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            const defaultLanguageId = languageId || languagesData?.languages?.find((el) => el.isDefault)?.id;

            Api.productCategoriesApi.getProductCategories({ lang: defaultLanguageId }).then((results) => setProductCategoriesData(results));

            if (!productId || !languageId) {
                return;
            }

            Api.productsApi.getTranslated(productId, languageId).then((product) => {
                if (!product?.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(Constant.PRODUCTS_BASE_PATH);
                    return;
                }

                setInitialValues(product.product);
            });
        });
    }, [languagesData?.languages]);

    useEffect(() => {
        if (productCategoriesData?.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PRODUCTS_BASE_PATH);
            return;
        }
    }, [productCategoriesData]);

    const handlesubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productsApi.createProduct(values);
            if (result.result) {
                NotificationManager.success('Le produit a bien été créé.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProductsAction());
                navigate(Constant.PRODUCTS_BASE_PATH);
            }
        });
    };

    if (!productCategoriesData || (productId && !initialValues)) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handlesubmit}
            productCategoriesList={productCategoriesData?.productCategories}
            translateInitialValues={initialValues}
            formCrud={Crud?.products?.add}
        />
    );
};
