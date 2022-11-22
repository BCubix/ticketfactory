import React, { useMemo } from 'react';
import { FormControlLabel, FormHelperText, InputLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

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
    setFieldValue,
    handleBlur,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    const getList = useMemo(() => {
        if (!field || !field?.parameters?.choices) {
            return;
        }

        let list = [];

        field?.parameters?.choices?.split('\n')?.forEach((element) => {
            const line = element.split(':');
            let val = line[0].trim();
            let lab = line.length > 1 ? line[1].trim() : value;

            list.push({ value: val, label: lab });
        });

        return list;
    }, []);

    return (
        <Box sx={{ marginBlock: 3 }}>
            <InputLabel id={`choice-${name}-label`} size="small">
                {label}
            </InputLabel>
            <RadioGroup
                size="small"
                id={`choice-${name}`}
                value={values[field.name]}
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                onBlur={handleBlur}
                label={label}
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                {getList?.map((item, index) => (
                    <FormControlLabel
                        key={index}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                    />
                ))}
                {touched && touched[field.name] && errors && errors[field.name] && (
                    <FormHelperText error>{errors[field.name]}</FormHelperText>
                )}
            </RadioGroup>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = () => {
    return '';
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
