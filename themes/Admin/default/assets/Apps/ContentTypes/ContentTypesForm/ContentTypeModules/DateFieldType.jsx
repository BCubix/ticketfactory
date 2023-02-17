import React from 'react';
import moment from 'moment';

import { FormControlLabel, Switch } from '@mui/material';

import { Component } from '@/AdminService/Component';

const NAME = 'date';
const LABEL = 'Date';

const TYPE = 'date';
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
        </>
    );
};

const Validations = ({ values, errors, index, setFieldTouched, setFieldValue, prefixName }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.validations.disablePast)}
                            onChange={(e) => {
                                setFieldValue(`${prefixName}fields.${index}.validations.disablePast`, e.target.checked);
                            }}
                        />
                    }
                    label={'Désactiver les dates passées'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtDatePicker
                            fullWidth
                            value={values.validations.minDate}
                            setValue={(newValue) => {
                                setFieldValue(`${prefixName}fields.${index}.validations.minDate`, moment(newValue).format('YYYY-MM-DD'));
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.minDate`}
                            error={errors?.validations?.minDate}
                        />
                    }
                    label={'Date minimum'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtDatePicker
                            fullWidth
                            value={values.validations.maxDate}
                            setValue={(newValue) => {
                                setFieldValue(`${prefixName}fields.${index}.validations.maxDate`, moment(newValue).format('YYYY-MM-DD'));
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.maxDate`}
                            error={errors?.validations?.maxDate}
                        />
                    }
                    label={'Date maximum'}
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
    options: { required: false, disabled: false },
    validations: { disablePast: false, minDate: '', maxDate: '' },
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
