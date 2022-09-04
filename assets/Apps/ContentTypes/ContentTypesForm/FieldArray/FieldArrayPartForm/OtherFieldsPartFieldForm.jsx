import { Box } from '@mui/material';
import React from 'react';
import { DisplayOtherFieldsForm } from '../../fieldsType/DisplayOtherFieldsForm';
import { FIELDS_TYPE } from '../../fieldsType/fieldsType';

export const OtherFieldsPartFieldForm = ({
    values,
    fieldIndex,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName,
}) => {
    const otherFieldsList =
        FIELDS_TYPE?.find((el) => el.name === values?.fieldType)?.otherFields || [];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
            }}
        >
            {otherFieldsList?.map((item, index) => (
                <DisplayOtherFieldsForm
                    field={item}
                    key={index}
                    values={values}
                    index={fieldIndex}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    prefixName={prefixName}
                />
            ))}
        </Box>
    );
};
