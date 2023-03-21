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
        fields[el.name] = contentModules[el.type]?.getInitialValue(el) || '';
    });

    return { ...fields };
};

const getSubValidation = (contentType, contentModule) => {
    if (!contentModule?.VALIDATION_TYPE || !contentModule?.VALIDATION_LIST) {
        return {};
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

const getValidation = (contentType) => {
    let validation = {};
    const contentModules = ContentModules();

    contentType?.parameters?.fields?.forEach((el) => {
        validation[el.name] = contentModules[el.type]?.getValidation ? contentModules[el.type].getValidation(el) : getSubValidation(el, contentModules[el.type]);
    });

    return Yup.object()
        .shape({ ...validation })
        .nullable();
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    getValidation,
};
