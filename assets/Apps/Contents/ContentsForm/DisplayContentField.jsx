import React from 'react';
import { CONTENT_MODULES_EXTENSION } from '../../../Constant';

export const DisplayContentField = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    field,
    contentModules,
    prefixName,
}) => {
    const moduleName =
        String(field.type).charAt(0).toUpperCase() +
        field.type?.slice(1) +
        CONTENT_MODULES_EXTENSION;

    const FormComponent =
        (contentModules &&
            contentModules[moduleName] &&
            contentModules[moduleName].FormComponent) ||
        null;

    if (!FormComponent) {
        return <>Ce composant n'existe pas</>;
    }

    return (
        <FormComponent
            values={values?.fields}
            handleChange={handleChange}
            handleBlur={handleBlur}
            name={`${prefixName}fields.${field.name}`}
            errors={errors.fields}
            touched={touched.fields}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            label={field.title}
            field={field}
            contentModules={contentModules}
        />
    );
};
