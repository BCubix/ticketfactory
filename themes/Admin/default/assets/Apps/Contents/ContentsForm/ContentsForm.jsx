import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box, Button } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import ContentModules from '@Apps/Contents/ContentsForm/ContentModules';

import { changeSlug } from '@Services/utils/changeSlug';

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType, translateInitialValues = null }) => {
    const [initValue, setInitValue] = useState(null);

    const getContentModules = useMemo(() => {
        return ContentModules();
    }, []);

    const getValidation = (contentType, contentModule) => {
        if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
            return;
        }

        let validation = Yup[contentModule?.VALIDATION_TYPE]();

        const valList = { ...contentType.validations, ...contentType.options };

        contentModule?.VALIDATION_LIST?.forEach((element) => {
            const elVal = valList[element.name];
            if (elVal && element.test(elVal.value)) {
                validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
            }
        });

        return validation;
    };

    const getFieldsValidation = (contentType) => {
        let validation = {};

        contentType.fields?.forEach((el) => {
            validation[el.name] = getContentModules[el.type]?.getValidation ? getContentModules[el.type].getValidation(el) : getValidation(el, getContentModules[el.type]);
        });

        return Yup.object().shape({ ...validation });
    };

    let contentValidationSchema = useMemo(() => {
        return Yup.object().shape({
            contentType: Yup.number().required('Veuillez renseigner le type de contenu.'),
            title: Yup.string().required('Veuillez renseigner le titre du contenu.'),
            fields: getFieldsValidation(initialValues?.contentType || selectedContentType),
        });
    });

    useEffect(() => {
        let initVal = translateInitialValues || initialValues;

        if (initVal) {
            setInitValue({
                active: initVal?.active || false,
                slug: initVal?.slug || '',
                fields: { ...initVal?.fields },
                title: initVal?.title || '',
                contentType: initVal?.contentType?.id || selectedContentType?.id,
                lang: initVal?.lang?.id || '',
                languageGroup: initVal?.languageGroup || '',
                editSlug: false,
            });

            return;
        }

        const formModules = getContentModules;

        let fields = {};

        selectedContentType?.fields?.forEach((el) => {
            fields[el.name] = formModules[el.type]?.getInitialValue(el) || '';
        });

        setInitValue({
            active: false,
            slug: '',
            fields: fields,
            title: '',
            contentType: selectedContentType?.id,
            lang: '',
            languageGroup: '',
            editSlug: false,
        });
    }, []);

    if (!initValue) {
        return <></>;
    }

    return (
        <Formik
            initialValues={initValue}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
            validationSchema={contentValidationSchema}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un contenu`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.title}
                            onChange={(e) => {
                                setFieldValue('title', e.target.value);
                                if (!values.editSlug && !initialValues) {
                                    setFieldValue('slug', changeSlug(e.target.value));
                                }
                            }}
                            onBlur={handleBlur}
                            label="Titre du contenu"
                            name="title"
                            error={touched.title && errors.title}
                            required
                        />
                        <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                    </Component.CmtFormBlock>
                    <Component.CmtFormBlock title="Formulaire">
                        <Component.DisplayContentForm
                            values={values.fields}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            contentType={selectedContentType}
                            contentModules={getContentModules}
                            prefixName="fields."
                        />
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Contenu actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
