import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { FieldFormControl } from '../sc.ContentTypeFields';

const NAME = 'password';
const LABEL = 'Mot de passe';

const TYPE = 'password';
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

const Validations = ({ values, errors, index, handleChange, handleBlur, prefixName }) => {
    return (
        <>
            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTextField
                            value={values.validations.minLength}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.minLength`}
                            error={errors?.validations?.minLength}
                            type="number"
                        />
                    }
                    label={'Longueur minimum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <CmtTextField
                            value={values.validations.maxLength}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.maxLength`}
                            error={errors?.validations?.maxLength}
                            type="number"
                        />
                    }
                    label={'Longueur maximum'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.validations.minChar)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.minChar`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Caractères minuscule'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.validations.majChar)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.majChar`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Caractères majuscule'}
                    labelPlacement="start"
                />
            </FieldFormControl>

            <FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.validations.numberChar)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.numberChar`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Caractères numériques'}
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
    options: { required: false, disabled: false, trim: false },
    validations: { minLength: '', maxLength: '', minChar: true, majChar: false, numberChar: false },
});

export default {
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
