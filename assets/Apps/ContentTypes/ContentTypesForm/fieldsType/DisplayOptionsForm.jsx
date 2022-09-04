import { Box, FormControlLabel } from '@mui/material';
import React from 'react';
import { FieldFormControl } from '../sc.ContentTypeFields';
import { FIELDS_FORM_TYPE } from './FieldsComponents';

export const DisplayOptionsForm = ({
    option,
    index,
    values,
    onChange,
    onBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    prefixName,
    ...rest
}) => {
    const OptionForm = FIELDS_FORM_TYPE?.find((el) => el.type === option?.type)?.component;

    if (!OptionForm) {
        return <></>;
    }

    return (
        <FieldFormControl fullWidth>
            <FormControlLabel
                control={
                    <OptionForm
                        value={values.options[option.name]}
                        name={`fields.${index}.options.${option.name}`}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={
                            touched?.options &&
                            touched?.options[option.name] &&
                            errors?.options &&
                            errors?.options[option.name]
                        }
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        touched={touched}
                        prefixName={prefixName}
                    />
                }
                label={
                    <Box>
                        {option.label}
                        {option?.instructions && <option.instructions />}
                    </Box>
                }
                labelPlacement="start"
            />
        </FieldFormControl>
    );
};
