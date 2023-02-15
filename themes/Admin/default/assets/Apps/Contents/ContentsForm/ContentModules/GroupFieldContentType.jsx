import React from 'react';
import * as Yup from 'yup';
import { Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import ContentModules from '@Apps/Contents/ContentsForm/ContentModules/index';

const TYPE = 'group';

const FormComponent = ({ values, handleChange, handleBlur, setFieldTouched, setFieldValue, name, errors, field, label, touched, contentModules }) => {
    return (
        <>
            <Component.CmtFormBlock title={label}>
                {values && (
                    <Component.DisplayContentForm
                        values={values[field.name]}
                        errors={(errors && errors[field.name]?.parameters) || {}}
                        touched={(touched && touched[field.name]?.parameters) || {}}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        contentType={field?.parameters}
                        contentModules={contentModules}
                        prefixName={`${name}.`}
                    />
                )}

                {field.helper && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                        {field.helper}
                    </Typography>
                )}
            </Component.CmtFormBlock>
        </>
    );
};

const getInitialValue = (field) => {
    const contentModules = ContentModules();

    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        const moduleName = String(el.type).charAt(0).toUpperCase() + el.type?.slice(1) + Constant.CONTENT_MODULES_EXTENSION;

        fields[el.name] = contentModules[moduleName]?.getInitialValue(el) || '';
    });

    return { fields: fields };
};

const getSubValidation = (contentType, contentModule) => {
    if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
        return;
    }

    let validation = Yup[contentModule?.VALIDATION_TYPE]();

    const valList = [...contentType.validations, ...contentType.options];

    contentModule?.VALIDATION_LIST?.forEach((element) => {
        const elVal = valList.find((el) => el.name === element.name);
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](...element.params({ name: contentType.title, value: elVal.value }));
        }
    });

    return validation;
};

const getValidation = (contentType) => {
    let validation = {};
    const contentModules = ContentModules();

    contentType?.parameters?.fields?.forEach((el) => {
        const moduleName = String(el.type).charAt(0).toUpperCase() + el.type?.slice(1) + Constant.CONTENT_MODULES_EXTENSION;

        validation[el.name] = contentModules[moduleName]?.getValidation ? contentModules[moduleName].getValidation(el) : getSubValidation(el, contentModules[moduleName]);
    });

    return Yup.array().of(Yup.object().shape({ ...validation }));
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    getValidation,
};
