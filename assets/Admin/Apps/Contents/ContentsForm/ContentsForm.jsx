import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box, Button, FormControlLabel, Switch } from '@mui/material';

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import ContentModules from "@Apps/Contents/ContentsForm/ContentModules";

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType }) => {
    const [initValue, setInitValue] = useState(null);

    const getContentModules = useMemo(() => {
        return ContentModules();
    }, []);

    const getValidation = (contentType, contentModule) => {
        if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
            return;
        }

        let validation = Yup[contentModule?.VALIDATION_TYPE]();

        const valList = [...contentType.validations, ...contentType.options];

        contentModule?.VALIDATION_LIST?.forEach((element) => {
            const elVal = valList.find((el) => el.name === element.name);
            if (elVal && element.test(elVal.value)) {
                validation = validation[element.validationName](
                    ...element.params({ name: contentType.title, value: elVal.value })
                );
            }
        });

        return validation;
    };

    const getFieldsValidation = (contentType) => {
        let validation = {};

        contentType.fields?.forEach((el) => {
            const moduleName =
                String(el.type).charAt(0).toUpperCase() +
                el.type?.slice(1) +
                Constant.CONTENT_MODULES_EXTENSION;

            validation[el.name] = getContentModules[moduleName]?.getValidation
                ? getContentModules[moduleName].getValidation(el)
                : getValidation(el, getContentModules[moduleName]);
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
        if (initialValues) {
            setInitValue({
                active: initialValues?.active || false,
                fields: { ...initialValues?.fields },
                title: initialValues?.title || '',
                contentType: initialValues?.contentType?.id || selectedContentType?.id,
            });

            return;
        }

        const formModules = getContentModules;

        let fields = {};

        selectedContentType?.fields?.forEach((el) => {
            const moduleName =
                String(el.type).charAt(0).toUpperCase() +
                el.type?.slice(1) +
                Constant.CONTENT_MODULES_EXTENSION;

            fields[el.name] = formModules[moduleName]?.getInitialValue(el) || '';
        });

        setInitValue({
            active: false,
            fields: fields,
            title: '',
            contentType: selectedContentType?.id,
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
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'un contenu`}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre du contenu"
                            name="title"
                            error={touched.title && errors.title}
                            required
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Formulaire">
                        <Component.DisplayContentForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            contentType={selectedContentType}
                            contentModules={getContentModules}
                        />
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end">
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
                                    onChange={(e) => {
                                        setFieldValue('active', e.target.checked);
                                    }}
                                />
                            }
                            label={'Activé ?'}
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
