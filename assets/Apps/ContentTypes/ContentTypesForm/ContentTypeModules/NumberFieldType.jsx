import React from 'react';
import { Box } from '@mui/system';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { FormControlLabel, Switch } from '@mui/material';
import { FieldFormControl } from '../sc.ContentTypeFields';

const NAME = 'number';
const LABEL = 'Nombre';

const TYPE = 'number';
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

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.scale)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.scale`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Nombre de chiffres après la virgule'}
                    labelPlacement="start"
                />
            </FieldFormControl>
        </>
    );
};

const Validations = ({ values, errors, index, handleChange, handleBlur, prefixName }) => {
    return (
        <>
            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTextField
                            value={values.validations.min}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.min`}
                            error={errors?.validations?.min}
                            type="number"
                        />
                    }
                    label={'Valeur minimum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTextField
                            value={values.validations.max}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.max`}
                            error={errors?.validations?.max}
                            type="number"
                        />
                    }
                    label={'Valeur maximum'}
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
    validations: { min: '', max: '' },
});

export default {
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
