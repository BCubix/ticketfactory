import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
import { contentTypeFieldsSelector } from '../../../../../redux/contentTypeFields/contentTypeFieldsSlice';
import { DisplayOptionsForm } from '../../fieldsType/DisplayOptionsForm';

export const OptionsPartFieldForm = ({
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
    const { contentTypeFields } = useSelector(contentTypeFieldsSelector);

    if (!contentTypeFields || !values?.fieldType) {
        return <></>;
    }

    const optionsList =
        Object.entries(contentTypeFields[values?.fieldType]?.options).map(([key, value]) => ({
            name: key,
            ...value,
        })) || [];

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
                    prefixName={prefixName}
                />
            ))}
        </Box>
    );
};
