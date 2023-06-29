import React from 'react';
import { FormHelperText } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Box } from '@mui/system';

const NAME = 'Tableau';
const LABEL = 'Tableau';

const TYPE = 'collection';
const TYPE_GROUP_NAME = 'Groupes';

const ComplementInformation = ({ values, index, handleChange, handleBlur, setFieldValue, setFieldTouched, prefixName, errors, touched, contentTypesModules }) => {
    return (
        <>
            <Box p={2}>
                <Component.ContentTypeFieldArrayForm
                    values={values.parameters || {}}
                    errors={errors?.parameters}
                    touched={touched?.parameters}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    prefixName={`${prefixName}fields.${index}.parameters.`}
                    contentTypesModules={contentTypesModules}
                />
            </Box>
            {errors && errors[`${prefixName}fields.${index}`] && typeof errors[`${prefixName}fields.${index}`] === 'string' && (
                <FormHelperText error>{errors[`${prefixName}fields.${index}`]}</FormHelperText>
            )}
        </>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [];

const setInitialValues = (prefixName, setFieldValue, contentTypesModules) => {
    const type = 'text';
    const initialValues = contentTypesModules[type].getInitialValues();

    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
    setFieldValue(`${prefixName}.parameters`, {
        fields: [{ title: '', name: '', type: type, helper: '', options: initialValues.options, validations: initialValues.validations || {} }],
    });
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
