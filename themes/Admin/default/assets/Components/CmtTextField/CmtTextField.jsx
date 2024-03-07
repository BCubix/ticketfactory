import React from 'react';
import { TextField } from '@mui/material';

export const CmtTextField = ({
    margin = 'normal',
    size = 'small',
    variant = 'standard',
    value,
    handleChange,
    handleBlur,
    onChange,
    onBlur,
    name,
    required = false,
    id = name?.replaceAll('.', '-'),
    className = null,
    label,
    error,
    fullWidth = true,
    color = 'primary',
    disabled = false,
    type = 'string',
    rows = 1,
    multiline = false,
    autoComplete = '',
    sx = null,
}) => {
    return (
        <TextField
            margin={margin}
            size={size}
            value={value}
            variant={variant}
            onChange={onChange || handleChange}
            onBlur={onBlur || handleBlur}
            required={required}
            fullWidth={fullWidth}
            autoComplete={autoComplete}
            id={id}
            {...(className && { className: className })}
            color={color}
            label={label}
            name={name}
            error={Boolean(error)}
            helperText={error}
            disabled={disabled}
            type={type}
            rows={rows}
            multiline={multiline}
            {...(sx && { sx: sx })}
        />
    );
};
