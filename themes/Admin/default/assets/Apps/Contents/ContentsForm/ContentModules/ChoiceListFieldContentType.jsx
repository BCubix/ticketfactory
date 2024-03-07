import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

const TYPE = 'list';

const VALIDATION_TYPE = 'string';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },
];

const FormComponent = ({ values, setFieldValue, handleBlur, name, errors, field, label, touched }) => {
    let val = field?.options?.multiple ? (Array.isArray(values[field.name]) ? values[field.name] : []) : values[field.name];

    const getList = useMemo(() => {
        if (!field || !field?.parameters?.choices) {
            return null;
        }

        let list = [];

        field?.parameters?.choices?.split('\n')?.forEach((element) => {
            const line = element.split(':');
            let val = line[0].trim();
            let lab = line.length > 1 ? line[1].trim() : val;

            list.push({ value: val, label: lab });
        });

        return list;
    }, []);

    return (
        <Box sx={{ marginBlock: 3 }}>
            <Component.CmtSelect
                {...{ label, setFieldValue, name }}
                required={field?.options?.required}
                multiple={field?.options?.multiple}
                disabled={field?.options?.disabled}
                id={`choice-${name}`}
                value={val}
                list={getList}
                touched={touched && touched[field.name]}
                errors={errors && errors[field.name]}
                getValue={(item) => item?.value}
                getName={(item) => item?.label}
            />
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
                    {field.helper}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = (field) => {
    return field?.options?.multiple ? [] : '';
};

export default {
    TYPE,
    FormComponent,
    getInitialValue,
    VALIDATION_LIST,
    VALIDATION_TYPE,
};
