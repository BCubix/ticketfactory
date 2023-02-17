import React from 'react';

export const DisplayContentField = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, field, contentModules, prefixName }) => {
    const FormComponent = (contentModules && contentModules[field.type] && contentModules[field.type].FormComponent) || null;

    if (!FormComponent) {
        return <>Ce composant n'existe pas</>;
    }

    return (
        <FormComponent
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            name={`${prefixName}${field.name}`}
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
