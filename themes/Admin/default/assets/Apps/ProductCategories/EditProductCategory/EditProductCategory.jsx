import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getProductCategoriesAction } from '@Apps/ProductCategories/redux/productCategories/productCategoriesSlice';

import { Crud } from '@/AdminService/Crud';
import { productCategoriesInitialSchema, productCategoriesValidationSchema, productCategoriesForm } from '../ProductCategoriesForm/ProductCategoriesForm';

export const productCategoriesEditCrud = {
    form: {
        title: "Modification d'une catégorie de produit",
        initialSchema: productCategoriesInitialSchema,
        validationSchema: productCategoriesValidationSchema,
    },
    ...productCategoriesForm,
};

export const EditProductCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [productCategory, setProductCategory] = useState(null);
    const [productCategoriesData, setProductCategoriesData] = useState(null);

    const [queryParameters] = useSearchParams();
    const parentId = queryParameters.get('parentId');

    const getProductCategory = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.getOneProductCategory(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                return;
            }

            setProductCategory(result.productCategory);

            Api.productCategoriesApi.getProductCategories({ lang: result?.category?.lang?.id }).then((productCategoriesList) => {
                if (!productCategoriesList.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
                    return;
                }

                setProductCategoriesData(productCategoriesList);
            });
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
            return;
        }

        getProductCategory(id);
    }, [id]);

    const handleSubmit = async (values) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productCategoriesApi.editProductCategory(id, values);
            if (result.result) {
                NotificationManager.success('La catégorie de produit a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getProductCategoriesAction());
                navigate(`${Constant.PRODUCT_CATEGORIES_BASE_PATH}${parentId ? `/${parentId}` : ''}`);
            } else if (result?.error?.httpcode >= 400 && result?.error?.httpcode <= 500) {
                NotificationManager.error(result?.error?.message, 'Erreur', Constant.REDIRECTION_TIME);
            }
        });
    };

    if (!productCategory) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={productCategory}
            productCategoriesList={productCategoriesData?.productCategories}
            formCrud={Crud?.productCategories?.edit}
        />
    );
};
