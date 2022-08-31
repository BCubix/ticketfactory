import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import React, { useMemo } from 'react';

export const RadioButtonContentField = ({
    value,
    label,
    setFieldValue,
    onBlur,
    name,
    error,
    options,
}) => {
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
            <FormLabel id={`choice-${name}-label`} size="small">
                {label}
            </FormLabel>
            <RadioGroup
                defaultValue={getList ? getList[0].value : ''}
                name={name}
                labelId={`choice-${name}-label`}
                size="small"
                id={`choice-${name}`}
                value={value}
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                onBlur={onBlur}
                label={label}
                sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}
            >
                {getList?.map((item, index) => (
                    <FormControlLabel
                        key={index}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                    />
                ))}
            </RadioGroup>
            <FormHelperText error>{error}</FormHelperText>
        </FormControl>
    );
};
