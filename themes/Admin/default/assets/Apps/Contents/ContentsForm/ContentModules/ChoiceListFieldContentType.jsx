import React, { useMemo } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';

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
            <FormControl fullWidth>
                <InputLabel id={`choice-${name}-label`} size="small">
                    {label}
                </InputLabel>
                <Select
                    labelId={`choice-${name}-label`}
                    variant="standard"
                    size="small"
                    id={`choice-${name}`}
                    value={val}
                    onChange={(e) => {
                        setFieldValue(name, e.target.value);
                    }}
                    onBlur={handleBlur}
                    name={name}
                    label={label}
                    multiple={field?.options?.multiple}
                >
                    {getList?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
                {touched && touched[field.name] && errors && errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
            </FormControl>
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
