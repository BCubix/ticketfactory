import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { Component } from '@/AdminService/Component';

const NAME = 'groupFields';
const LABEL = 'Groupes de champs';

const TYPE = 'groupFields';
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
        </>
    );
};

const Options = ({ values, index, setFieldValue, prefixName }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.required)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.options.required`, e.target.checked);
                            }}
                        />
                    }
                    label={'Requis'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.disabled)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.options.disabled`, e.target.checked);
                            }}
                        />
                    }
                    label={'Désactivé'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: NAME, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [{ label: 'Options', component: (props) => <Options {...props} /> }];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
    setFieldValue(`${prefixName}.parameters`, getInitialValues().parameters);
};

const getInitialValues = () => ({
    options: { required: false, disabled: false },
    validations: {},
    parameters: { fields: [] },
});

export default {
    Options,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
