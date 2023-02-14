import React from 'react';
import moment from 'moment';
import { FormControlLabel, Switch } from '@mui/material';
import { Component } from '@/AdminService/Component';

const NAME = 'time';
const LABEL = 'Heure';

const TYPE = 'time';
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
                        <Component.CmtTimePicker
                            fullWidth
                            value={values.validations.minHour}
                            setValue={(newValue) => {
                                setFieldValue(`${prefixName}fields.${index}.validations.minHour`, moment(newValue).format('HH:mm'));
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.minHour`}
                            error={errors?.validations?.minHour}
                            inputSize="small"
                        />
                    }
                    label={'Heure minimum'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTimePicker
                            fullWidth
                            value={values.validations.maxHour}
                            setValue={(newValue) => {
                                setFieldValue(`${prefixName}fields.${index}.validations.maxHour`, moment(newValue).format('HH:mm'));
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.maxHour`}
                            error={errors?.validations?.maxHour}
                            inputSize="small"
                        />
                    }
                    label={'Heure maximum'}
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
    validations: { minHour: '', maxHour: '' },
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
