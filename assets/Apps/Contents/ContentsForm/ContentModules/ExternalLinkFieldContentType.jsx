import { Typography } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import * as Yup from 'yup';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({
    values,
    handleChange,
    handleBlur,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    return (
        <>
            <CmtTextField
                value={values[field.name]}
                label={label}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                error={touched && touched[field.name] && errors && errors[field.name]}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                type="url"
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return '';
};

const getValidation = (contentType) => {
    let validation = Yup[VALIDATION_TYPE]();

    validation = validation['matches'](
        ...[
            /^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
            'Url invalide',
        ]
    );

    const valList = [...contentType.validations, ...contentType.options];

    VALIDATION_LIST.forEach((element) => {
        const elVal = valList.find((el) => el.name === element.name);
        if (elVal && element.test(elVal.value)) {
            validation = validation[element.validationName](
                ...element.params({ name: contentType.title, value: elVal.value })
            );
        }
    });

    return validation;
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
    getValidation,
};
