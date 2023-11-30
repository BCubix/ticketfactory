import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';
import { SeoInitialValues, SeoInitialFormInputs, SeoApiDataFields } from '@Apps/SEO/Form/SEOForm';
import { DEFAULT_CRUD_FORM_COMPONENTS } from '@Components/CmtCrudForm/CmtCrudForm';
import { changeSlug } from '@Services/utils/changeSlug';

export const productsInitialSchema = {
    active: (initValues) => initValues?.active || false,
    name: (initValues) => initValues?.name || '',
    slug: (initValues) => initValues?.slug || '',
    chapo: (initValues) => initValues?.chapo || '',
    description: (initValues) => initValues?.description || '',
    price: (initValues) => initValues?.price || '',
    mainCategory: (initValues, { productCategoriesList }) => initValues?.mainCategory?.id || productCategoriesList?.id || '',
    productCategories: (initValues, { productCategoriesList }) => (initValues?.productCategories ? initValues?.productCategories?.map((el) => el.id) : [productCategoriesList.id]),
    productMedias: (initValues) =>
        initValues?.productMedias?.map((el) => ({
            mainImg: el.mainImg,
            position: el.position,
            id: el.media?.id,
            media: el.media,
        })) || [],
    lang: (initValues) => initValues?.lang?.id || '',
    languageGroup: (initValues) => initValues?.languageGroup || '',
    seo: SeoInitialValues,
    editSlug: false,
};

export const productsValidationSchema = {
    name: Yup.string().required('Veuillez renseigner le nom du produit.').max(250, 'Le nom du produit est trop long'),
    chapo: Yup.string().required('Veuillez renseigner le chapô.'),
    productCategories: Yup.array().min(1, 'Veuillez renseigner au moins une catégorie.'),
    mainCategory: Yup.string().required('Veuillez renseigner la catégorie principale.'),
    description: Yup.string().required('Veuillez renseigner une description.'),
    price: Yup.number().required('Veuillez renseigner un prix').min(0, 'Le prix renseigné est invalide'),
};

export const productsForm = {
    submitLine: {
        activeInput: true,
        activeLabel: 'Produit actif ?',
    },
    api: {
        dataFields: {
            active: { type: 'boolean' },
            name: { type: 'string' },
            slug: { type: 'string' },
            chapo: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'string' },
            mainCategory: { type: 'string' },
            productCategories: {
                function: ({ values, formData }) => {
                    values?.productCategories?.forEach((category, index) => {
                        formData.append(`productCategories[${index}]`, category);
                    });
                },
            },
            productMedias: {
                type: 'array',
                subFields: {
                    media: { function: ({ values, formData, baseName }) => formData.append(`${baseName}[media]`, values.id) },
                    position: { function: ({ values, formData, baseName, index }) => formData.append(`${baseName}[position]`, values.position || index + 1) },
                },
            },
            slug: { type: 'slug' },
            lang: { type: 'string' },
            languageGroup: { type: 'string' },
            seo: SeoApiDataFields,
        },
    },
    fields: [
        {
            type: 'tabs',
            keyId: 'product',
            label: 'Produit',
            fields: [
                {
                    type: 'block',
                    title: 'Informations générales',
                    keyId: 'block-general-info',
                    fields: [
                        {
                            keyId: 'input-name',
                            style: { xs: 12, sm: 6, md: 8 },
                            inputs: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'textField',
                                    required: true,
                                    custom: {
                                        handleChange:
                                            ({ values, initialValues, setFieldValue }) =>
                                            (e) => {
                                                setFieldValue('name', e.target.value);
                                                if (!values.editSlug && !initialValues) {
                                                    setFieldValue('slug', changeSlug(e.target.value));
                                                }
                                            },
                                    },
                                },
                                {
                                    name: 'slug',
                                    inputType: 'slugInput',
                                },
                            ],
                        },
                        {
                            keyId: 'input-price',
                            style: { xs: 12, sm: 6, md: 4 },
                            input: {
                                name: 'price',
                                label: 'Prix',
                                inputType: 'textField',
                                type: 'number',
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-chapo',
                            style: { xs: 12 },
                            input: {
                                name: 'chapo',
                                label: 'Chapô',
                                inputType: 'textField',
                                multiline: true,
                                rows: 4,
                                required: true,
                            },
                        },
                        {
                            keyId: 'input-description',
                            style: { xs: 12 },
                            input: {
                                name: 'description',
                                label: 'Description',
                                inputType: 'editorField',
                                required: true,
                                id: 'description',
                            },
                        },
                    ],
                },
                {
                    keyId: 'block-categories',
                    title: 'Catégories',

                    fields: [
                        {
                            keyId: 'form-productCategory',
                            style: { xs: 12 },
                            component: (props) => <Component.ProductParentCategoryPartForm {...props} />,
                        },
                    ],
                },
                SeoInitialFormInputs,
            ],
        },
        {
            type: 'tabs',
            keyId: 'productMedias',
            label: 'Médias',
            fields: [
                {
                    keyId: 'product-productMedias',
                    component: (props) => <Component.CmtMediaPartForm {...props} name="productMedias" />,
                },
            ],
        },
    ],
    ...DEFAULT_CRUD_FORM_COMPONENTS,
};

export const ProductsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, productCategoriesList }) => {
    const initValues = translateInitialValues || initialValues;

    if (!productCategoriesList) {
        return <></>;
    }

    const productSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du produit.').max(250, 'Le nom du produit est trop long'),
        chapo: Yup.string().required('Veuillez renseigner le chapô.'),
        productCategories: Yup.array().min(1, 'Veuillez renseigner au moins une catégorie.'),
        mainCategory: Yup.string().required('Veuillez renseigner la catégorie principale.'),
        description: Yup.string().required('Veuillez renseigner une description.'),
        price: Yup.number().required('Veuillez renseigner un prix').min(0, 'Le prix renseigné est invalide'),
    });

    return (
        <Formik
            initialValues={{
                active: initValues?.active || false,
                name: initValues?.name || '',
                slug: initValues?.slug || '',
                chapo: initValues?.chapo || '',
                description: initValues?.description || '',
                price: initValues?.price || '',
                mainCategory: initValues?.mainCategory?.id || productCategoriesList.id,
                productCategories: initValues?.productCategories ? initValues?.productCategories?.map((el) => el.id) : [productCategoriesList.id],
                productMedias:
                    initValues?.productMedias?.map((el) => ({
                        mainImg: el.mainImg,
                        position: el.position,
                        id: el.media?.id,
                        media: el.media,
                    })) || [],
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                seo: {
                    metaTitle: initValues?.metaTitle || '',
                    metaDescription: initValues?.metaDescription || '',
                    socialImage: initValues?.socialImage || null,
                    fbTitle: initValues?.fbTitle || '',
                    fbDescription: initValues?.fbDescription || '',
                    twTitle: initValues?.twTitle || '',
                    twDescription: initValues?.twDescription || '',
                },
                editSlug: false,
            }}
            validationSchema={productSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un produit`}>
                    <Component.CmtTabs
                        containerStyle={{ mt: 3 }}
                        list={Tab.ProductsFormTabList({
                            values,
                            handleChange,
                            handleBlur,
                            touched,
                            errors,
                            setFieldTouched,
                            setFieldValue,
                            productCategoriesList,
                            initialValues: initValues,
                            editMode: Boolean(initialValues),
                        })}
                    />

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Produit actif ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
