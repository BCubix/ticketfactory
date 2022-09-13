import { InputLabel, Typography } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import LightEditor from '../../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../../Components/Editors/LightEditor/sc.LightEditorFormControl';

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
            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.instructions}
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
};
