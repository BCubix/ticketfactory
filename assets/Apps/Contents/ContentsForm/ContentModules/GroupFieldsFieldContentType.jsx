import { Typography } from '@mui/material';
import React from 'react';
import ContentModules from '.';
import { CmtFormBlock } from '../../../../Components/CmtFormBlock/CmtFormBlock';
import { CONTENT_MODULES_EXTENSION } from '../../../../Constant';
import { DisplayContentForm } from '../DisplayContentForm';

const FormComponent = ({
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    name,
    errors,
    field,
    label,
    touched,
    contentModules,
}) => {
    return (
        <>
            <CmtFormBlock title={label}>
                <DisplayContentForm
                    values={values[field.name]}
                    errors={(errors && errors[field.name]?.parameters) || {}}
                    touched={(touched && touched[field.name]?.parameters) || {}}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    contentType={field?.parameters}
                    contentModules={contentModules}
                    prefixName={`${name}.`}
                />

                {field.instructions && (
                    <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                        {field.instructions}
                    </Typography>
                )}
            </CmtFormBlock>
        </>
    );
};

const getInitialValue = (field) => {
    const contentModules = ContentModules();

    let fields = {};

    field?.parameters?.fields?.forEach((el) => {
        const moduleName =
            String(el.fieldType).charAt(0).toUpperCase() +
            el.fieldType?.slice(1) +
            CONTENT_MODULES_EXTENSION;

        fields[el.name] = contentModules[moduleName]?.getInitialValue(el) || '';
    });

    return { fields: fields };
};

export default {
    FormComponent,
    getInitialValue,
};
