import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';

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
    let val = field?.options?.multiple
        ? Array.isArray(values[field.name])
            ? values[field.name]
            : []
        : values[field.name];

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
            <FormControl fullWidth>
                <InputLabel id={`choice-${name}-label`} size="small">
                    {label}
                </InputLabel>
                <Select
                    labelId={`choice-${name}-label`}
                    size="small"
                    id={`choice-${name}`}
                    value={val}
                    onChange={(e) => {
                        setFieldValue(name, e.target.value);
                    }}
                    onBlur={handleBlur}
                    label={label}
                    multiple={field?.options?.multiple}
                >
                    {getList?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                    {touched && touched[field.name] && errors && errors[field.name] && (
                        <FormHelperText error>{errors[field.name]}</FormHelperText>
                    )}
                </Select>
            </FormControl>
            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10, marginTop: 3 }}>
                    {field.instructions}
                </Typography>
            )}
        </Box>
    );
};

const getInitialValue = (field) => {
    return field?.options?.multiple ? [] : '';
};

export default {
    FormComponent,
    getInitialValue,
};
