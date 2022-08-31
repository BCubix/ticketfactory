import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useMemo } from 'react';

export const ChoiceListContentField = ({
    value,
    label,
    setFieldValue,
    onBlur,
    name,
    error,
    options,
}) => {
    let val = options?.multiple ? (Array.isArray(value) ? value : []) : value;

    const getList = useMemo(() => {
        if (!options || !options?.choices) {
            return;
        }

        let list = [];

        options?.choices?.split('\n')?.forEach((element) => {
            const line = element.split(':');
            let val = line[0].trim();
            let lab = line.length > 1 ? line[1].trim() : value;

            list.push({ value: val, label: lab });
        });

        return list;
    }, [options?.choices]);

    return (
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
                onBlur={onBlur}
                label={label}
                multiple={options?.multiple}
            >
                {getList?.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
                <FormHelperText error>{error}</FormHelperText>
            </Select>
        </FormControl>
    );
};
