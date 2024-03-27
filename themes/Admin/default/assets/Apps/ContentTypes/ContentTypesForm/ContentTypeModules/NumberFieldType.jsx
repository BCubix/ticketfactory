import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { Component } from '@/AdminService/Component';

const NAME = 'number';
const LABEL = 'Nombre';

const TYPE = 'number';
const TYPE_GROUP_NAME = 'Champs de base';

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

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.scale)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.options.scale`, e.target.checked);
                            }}
                        />
                    }
                    label={'Nombre de chiffres après la virgule'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const Validations = ({ values, errors, index, handleChange, handleBlur, prefixName }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.lessThan}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.lessThan`}
                            error={errors?.validations?.lessThan}
                            type="number"
                        />
                    }
                    label={'Plus petit que'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.lessThanOrEqual}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.lessThanOrEqual`}
                            error={errors?.validations?.lessThanOrEqual}
                            type="number"
                        />
                    }
                    label={'Plus petit ou égal à'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.greaterThan}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.greaterThan`}
                            error={errors?.validations?.greaterThan}
                            type="number"
                        />
                    }
                    label={'Plus grand que'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.greaterThanOrEqual}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.greaterThanOrEqual`}
                            error={errors?.validations?.greaterThanOrEqual}
                            type="number"
                        />
                    }
                    label={'Plus grand ou égale à'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: TYPE, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [
    { label: 'Options', component: (props) => <Options {...props} /> },
    { label: 'Validations', component: (props) => <Validations {...props} /> },
];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
};

const getInitialValues = () => ({
    options: { required: false, disabled: false, scale: '' },
    validations: { lessThan: '', lessThanOrEqual: '', greaterThan: '', greaterThanOrEqual: '' },
});

export default {
    TYPE,
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
