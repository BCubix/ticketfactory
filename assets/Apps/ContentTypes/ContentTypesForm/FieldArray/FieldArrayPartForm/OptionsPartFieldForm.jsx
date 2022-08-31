import { Box } from '@mui/system';
import React from 'react';
import { DisplayOptionsForm } from '../../fieldsType/DisplayOptionsForm';
import { FIELDS_TYPE } from '../../fieldsType/fieldsType';

export const OptionsPartFieldForm = ({
    values,
    fieldIndex,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
}) => {
    const optionsList = FIELDS_TYPE?.find((el) => el.name === values?.fieldType)?.options || [];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {optionsList?.map((item, index) => (
                <DisplayOptionsForm
                    option={item}
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
