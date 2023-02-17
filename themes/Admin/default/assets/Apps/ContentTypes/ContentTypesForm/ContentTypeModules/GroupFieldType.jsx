import React from 'react';
import { FormControlLabel, FormHelperText, Switch } from '@mui/material';
import { Component } from '@/AdminService/Component';

const NAME = 'groupFields';
const LABEL = 'Groupes de champs';

const TYPE = 'group';
const TYPE_GROUP_NAME = 'Groupes';

const ComplementInformation = ({ values, index, handleChange, handleBlur, setFieldValue, setFieldTouched, prefixName, errors, touched, contentTypesModules }) => {
    return (
        <>
            <Component.ContentTypeFieldArrayForm
                values={values.parameters}
                errors={errors.parameters}
                touched={touched.parameters}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                prefixName={`${prefixName}fields.${index}.parameters.`}
                contentTypesModules={contentTypesModules}
            />
            {errors[`${prefixName}fields.${index}`] && typeof errors[`${prefixName}fields.${index}`] === 'string' && (
                <FormHelperText error>{errors[`${prefixName}fields.${index}`]}</FormHelperText>
            )}
        </>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
    setFieldValue(`${prefixName}.parameters`, getInitialValues().parameters);
};

const getInitialValues = () => ({
    options: {},
    validations: {},
    parameters: { fields: [] },
});

export default {
    TYPE,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
