import React from 'react';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';
import { CONTENT_FIELD_COMPONENT } from './ContentFieldComponent';

export const DisplayContentField = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    field,
    index,
}) => {
    const FormComponent = CONTENT_FIELD_COMPONENT.find(
        (el) => el.type === field.fieldType
    )?.component;

    if (!FormComponent) {
        return <></>;
    }

    return (
        <FormComponent
            value={values?.fields[index].value}
            onChange={handleChange}
            onBlur={handleBlur}
            name={`fields.${index}.value`}
            error={getNestedFormikError(touched.fields, errors.fields, index, 'value')}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            label={field.title}
            field={field}
        />
    );
};
