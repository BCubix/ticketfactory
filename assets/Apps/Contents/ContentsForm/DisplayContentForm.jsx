import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { DisplayContentField } from './DisplayContentField';

export const DisplayContentForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    contentType,
    contentModules,
    prefixName = '',
}) => {
    if (!contentType) {
        return <></>;
    }

    return contentType?.fields?.map((item, index) => (
        <Box sx={{ marginBlock: 4 }} key={index}>
            <DisplayContentField
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                field={item}
                key={index}
                index={index}
                contentModules={contentModules}
                prefixName={prefixName}
            />
        </Box>
    ));
};
