import React from 'react';
import * as Yup from 'yup';
import { Box, Typography } from '@mui/material';

import { Component } from '@/AdminService/Component';

const TYPE = 'group';

const FormComponent = ({
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    name,
    errors,
    field,
    label,
    touched,
    contentModules,
    displayGroupLabel = true,
    ...props
}) => {
    if (!displayGroupLabel) {
        return (
            <>
                <Component.DisplayContentForm
                    {...props}
                    values={(values && values[field.name]) || {}}
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
                {field.helper && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                        {field.helper}
                    </Typography>
                )}
            </>
        );
    }

    return (
        <Component.CmtFormBlock title={label}>
            <Component.DisplayContentForm
                {...props}
                values={(values && values[field.name]) || {}}
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

            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </Component.CmtFormBlock>
    );
};

const getInitialValue = (field, contentModules) => {
    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        fields[el.name] = contentModules[el.type]?.getInitialValue(el, contentModules) || '';
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

const getValidation = (contentType, contentModules) => {
    let validation = {};

    contentType?.parameters?.fields?.forEach((el) => {
        validation[el.name] = contentModules[el.type]?.getValidation ? contentModules[el.type].getValidation(el, contentModules) : getSubValidation(el, contentModules[el.type]);
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
