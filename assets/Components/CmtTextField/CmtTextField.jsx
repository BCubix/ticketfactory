import React from 'react';
import { TextField } from '@mui/material';

export const CmtTextField = ({
    margin = 'normal',
    size = 'small',
    value,
    handleChange,
    handleBlur,
    name,
    required = false,
    id = name,
    label,
    error,
    fullWidth = true,
    ...rest
}) => {
    return (
        <TextField
            margin={margin}
            size={size}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            fullWidth={fullWidth}
            id={id}
            label={label}
            name={name}
            error={Boolean(error)}
            helperText={error}
            {...rest}
        />
    );
};
