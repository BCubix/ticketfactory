import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getProductsAction } from '@Apps/Products/redux/products/productsSlice';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Crud } from '@/AdminService/Crud';
import { productsInitialSchema, productsValidationSchema, productsForm } from '../ProductsForm/ProductsForm';

export const productsEditCrud = {
    form: {
        title: "Modification d'un produit",
        initialSchema: productsInitialSchema,
        validationSchema: productsValidationSchema,
    },
    ...productsForm,
};

export const EditProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productCategoriesData, setProductCategoriesData] = useState(null);

    useEffect(() => {
        if (productCategoriesData?.error) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.PRODUCTS_BASE_PATH);
            return;
        }
    }, [productCategoriesData]);

    const getProduct = async (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.productsApi.getOneProduct(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.PRODUCTS_BASE_PATH);
                return;
            }

            setProduct(result.product);

            const defaultLanguageId = result?.product?.lang?.id;
            Api.productCategoriesApi.getProductCategories({ lang: defaultLanguageId }).then((results) => setProductCategoriesData(results));
        });
    };

    useEffect(() => {
        if (!id) {
            navigate(Constant.PRODUCTS_BASE_PATH);
            return;
        }

        getProduct(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const result = await Api.productsApi.editProduct(id, values);

        if (result.result) {
            NotificationManager.success('Le produit a bien été modifié.', 'Succès', Constant.REDIRECTION_TIME);

            dispatch(getProductsAction());

            navigate(Constant.PRODUCTS_BASE_PATH);
        }
    };

    if (!product || !productCategoriesData) {
        return <></>;
    }

    return (
        <Component.CmtCrudForm
            handleSubmit={handleSubmit}
            initialValues={product}
            productCategoriesList={productCategoriesData?.productCategories}
            formCrud={Crud.products?.edit}
        />
    );
};
