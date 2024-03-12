import React from 'react';

export const DisplayContentField = ({ errors, touched, field, contentModules, prefixName, ...props }) => {
    const FormComponent = (contentModules && contentModules[field.type] && contentModules[field.type].FormComponent) || null;

    if (!FormComponent) {
        return <>Ce composant n'existe pas</>;
    }

    return (
        <FormComponent
            {...props}
            name={`${prefixName}${field.name}`}
            errors={errors.fields}
            touched={touched.fields}
            label={field.title}
            field={field}
            contentModules={contentModules}
        />
    );
};
