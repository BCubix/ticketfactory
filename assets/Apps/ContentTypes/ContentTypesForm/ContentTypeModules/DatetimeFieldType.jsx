import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { FieldFormControl } from '../sc.ContentTypeFields';
import moment from 'moment';
import { CmtTimePicker } from '../../../../Components/CmtTimePicker/CmtTimePicker';
import { CmtDatePicker } from '../../../../Components/CmtDatePicker/CmtDatePicker';

const NAME = 'datetime';
const LABEL = 'Date / Heure';

const TYPE = 'datetime';
const TYPE_GROUP_NAME = 'Champs de base';

const Options = ({ values, index, setFieldValue, prefixName }) => {
    return (
        <>
            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.required)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.required`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Requis'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.disabled)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.disabled`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Désactivé'}
                    labelPlacement="start"
                />
            </FieldFormControl>
        </>
    );
};

const Validations = ({ values, errors, index, setFieldTouched, setFieldValue, prefixName }) => {
    return (
        <>
            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.validations.disablePast)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.disablePast`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Désactiver les dates passées'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtDatePicker
                            fullWidth
                            value={values.validations.minDate}
                            setValue={(newValue) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.minDate`,
                                    moment(newValue).format('YYYY-MM-DD')
                                );
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.minDate`}
                            error={errors?.validations?.minDate}
                            inputVariant={'outlined'}
                            inputSize="small"
                        />
                    }
                    label={'Date minimum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtDatePicker
                            fullWidth
                            value={values.validations.maxDate}
                            setValue={(newValue) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.maxDate`,
                                    moment(newValue).format('YYYY-MM-DD')
                                );
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.maxDate`}
                            error={errors?.validations?.maxDate}
                            inputVariant={'outlined'}
                            inputSize="small"
                        />
                    }
                    label={'Date maximum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTimePicker
                            fullWidth
                            value={values.validations.minHour}
                            setValue={(newValue) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.minHour`,
                                    moment(newValue).format('HH:mm')
                                );
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.minHour`}
                            error={errors?.validations?.minHour}
                            inputVariant="outlined"
                            inputSize="small"
                        />
                    }
                    label={'Heure minimum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTimePicker
                            fullWidth
                            value={values.validations.maxHour}
                            setValue={(newValue) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.maxHour`,
                                    moment(newValue).format('HH:mm')
                                );
                            }}
                            onTouched={setFieldTouched}
                            name={`${prefixName}fields.${index}.validations.maxHour`}
                            error={errors?.validations?.maxHour}
                            inputVariant="outlined"
                            inputSize="small"
                        />
                    }
                    label={'Heure maximum'}
                    labelPlacement="start"
                />
            </FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: NAME, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

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
    validations: { disablePast: false, minDate: '', maxDate: '', minHour: '', maxHour: '' },
});

export default {
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
