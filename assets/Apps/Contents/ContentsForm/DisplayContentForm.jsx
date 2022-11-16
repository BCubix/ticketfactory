import React from 'react';
import { Box } from '@mui/system';
import { Component } from "@/AdminService/Component";

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
            <Component.DisplayContentField
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
