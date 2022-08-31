import { Box, FormControlLabel } from '@mui/material';
import React from 'react';
import { FieldFormControl } from '../sc.ContentTypeFields';
import { FIELDS_FORM_TYPE } from './FieldsComponents';

export const DisplayValidationsForm = ({
    validation,
    index,
    values,
    onChange,
    onBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    ...rest
}) => {
    const ValidationsForm = FIELDS_FORM_TYPE?.find((el) => el.type === validation?.type)?.component;

    if (!ValidationsForm) {
        return <></>;
    }

    return (
        <FieldFormControl fullWidth>
            <FormControlLabel
                control={
                    <ValidationsForm
                        value={values.validations[validation.name]}
                        name={`fields.${index}.validations.${validation.name}`}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={
                            touched?.validations &&
                            touched?.validations[validation.name] &&
                            errors?.validations &&
                            errors?.validations[validation.name]
                        }
                        multiple={validation?.multiple}
                        list={validation?.list}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                    />
                }
                label={
                    <Box>
                        {validation.label}
                        {validation?.instructions && <validation.instructions />}
                    </Box>
                }
                labelPlacement="start"
            />
        </FieldFormControl>
    );
};
