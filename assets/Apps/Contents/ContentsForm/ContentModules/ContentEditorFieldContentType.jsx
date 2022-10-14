import { InputLabel, Typography } from '@mui/material';
import React from 'react';
import LightEditor from '../../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../../Components/Editors/LightEditor/sc.LightEditorFormControl';

const VALIDATION_TYPE = 'date';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({
    values,
    setFieldTouched,
    setFieldValue,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    return (
        <>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <LightEditorFormControl>
                <LightEditor
                    labelId={`${label}-label`}
                    value={values[field.name]}
                    onBlur={() => setFieldTouched(name, true, false)}
                    onChange={(val) => {
                        setFieldValue(name, val);
                    }}
                    required={field?.options?.required}
                    disabled={field?.options?.disabled}
                />
                {touched && touched[field.name] && errors && errors[field.name] && (
                    <FormHelperText error>{errors[field.name]}</FormHelperText>
                )}
            </LightEditorFormControl>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
};
