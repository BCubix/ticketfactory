import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { FieldFormControl } from '../sc.ContentTypeFields';

const NAME = 'map';
const LABEL = 'Carte';

const TYPE = 'map';
const TYPE_GROUP_NAME = 'Contenu';

const ComplementInformation = ({ values, index, handleChange, handleBlur, prefixName, errors }) => {
    return (
        <>
            <CmtTextField
                value={values.parameters.token}
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${prefixName}fields.${index}.parameters.token`}
                error={errors?.parameters?.token}
                required
                label="Token de la carte"
            />

            <CmtTextField
                value={values.parameters.mapStyle}
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${prefixName}fields.${index}.parameters.mapStyle`}
                error={errors?.parameters?.mapStyle}
                required
                label={'Style de la carte'}
            />
        </>
    );
};

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
    parameters: { token: '', mapStyle: '' },
});

export default {
    Options,
    ComplementInformation,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
