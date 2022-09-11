import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { FieldFormControl } from '../sc.ContentTypeFields';
import moment from 'moment';
import { CmtTimePicker } from '../../../../Components/CmtTimePicker/CmtTimePicker';

const NAME = 'time';
const LABEL = 'Heure';

const TYPE = 'time';
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
    options: { required: false, disabled: false },
    validations: { minHour: '', maxHour: '' },
});

export default {
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
