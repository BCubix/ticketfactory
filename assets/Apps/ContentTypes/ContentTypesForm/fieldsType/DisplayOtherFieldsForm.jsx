import React from 'react';
import { FIELDS_FORM_TYPE } from './FieldsComponents';

export const DisplayOtherFieldsForm = ({
    field,
    index,
    values,
    onChange,
    onBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    prefixName,
}) => {
    const FieldForm = FIELDS_FORM_TYPE?.find((el) => el.type === field?.type)?.component;

    if (!FieldForm) {
        return <></>;
    }

    if (field.type === 'groupFields') {
        return (
            <FieldForm
                value={values.otherFields}
                name={`fields.${index}.otherFields`}
                onChange={onChange}
                onBlur={onBlur}
                error={touched?.otherFields && errors?.otherFields}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                touched={touched}
                prefixName={prefixName}
            />
        );
    }

    return (
        <FieldForm
            value={values.otherFields[field.name]}
            name={`fields.${index}.otherFields.${field.name}`}
            onChange={onChange}
            onBlur={onBlur}
            error={
                touched?.otherFields &&
                touched?.otherFields[field.name] &&
                errors?.otherFields &&
                errors?.otherFields[field.name]
            }
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            touched={touched}
            prefixName={prefixName}
        />
    );
};
