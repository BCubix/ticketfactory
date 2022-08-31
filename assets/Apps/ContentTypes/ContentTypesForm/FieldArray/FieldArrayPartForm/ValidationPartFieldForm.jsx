import { Box } from '@mui/material';
import React from 'react';
import { DisplayValidationsForm } from '../../fieldsType/DisplayValidationsForm';
import { FIELDS_TYPE } from '../../fieldsType/fieldsType';

export const ValidationPartFieldForm = ({
    values,
    fieldIndex,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
}) => {
    const validationList =
        FIELDS_TYPE?.find((el) => el.name === values?.fieldType)?.validations || [];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {validationList?.map((item, index) => (
                <DisplayValidationsForm
                    validation={item}
                    key={index}
                    values={values}
                    index={fieldIndex}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            ))}
        </Box>
    );
};
