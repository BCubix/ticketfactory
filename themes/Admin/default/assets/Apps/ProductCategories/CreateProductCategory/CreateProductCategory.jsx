import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getProductCategoriesAction } from '@Apps/ProductCategories/redux/productCategories/productCategoriesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { productCategoriesInitialSchema, productCategoriesValidationSchema, productCategoriesForm } from '../ProductCategoriesForm/ProductCategoriesForm';

export const productCategoriesCreateCrud = {
    form: {
        title: "Creation d'une catégorie de produit",
        initialSchema: productCategoriesInitialSchema,
        validationSchema: productCategoriesValidationSchema,
    },
    ...productCategoriesForm,
};

export const CreateProductCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productCategoriesData, setProductCategoriesData] = useState(null);
    const [initialValues, setInitialValues] = useState(null);

    const [queryParameters] = useSearchParams();
    const productCategoryId = queryParameters.get('productCategoryId');
    const languageId = queryParameters.get('languageId');
    const parentId = queryParameters.get('parentId');

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.productCategoriesApi.getProductCategories({ lang: languageId }).then((productCategoriesList) => {
                if (!productCategoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setProductCategoriesData(productCategoriesList);
            });

            if (!productCategoryId || !languageId || initialValues) {
                return;
            }

            Api.productCategoriesApi.getTranslated(productCategoryId, languageId).then((productCategory) => {
                if (!productCategory?.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setInitialValues(productCategory.productCategory);
            });
        });
    }, []);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.createProductCategory(values);

            if (result.result) {
                NotificationManager.success('La catégorie de produit a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProductCategoriesAction());
                navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
            }
        });
    };

    if (productCategoryId && !initialValues) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            productCategoriesList={productCategoriesData?.productCategories}
            translateInitialValues={initialValues}
            parentId={parseInt(parentId) || null}
            formCrud={Crud?.productCategories?.add}
        />
    );
};
