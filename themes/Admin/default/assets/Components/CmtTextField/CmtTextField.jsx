import React from 'react';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
    helper = '',
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
            label={
                helper ? (
                    <>
                        {label}{' '}
                        <Tooltip title={<Box dangerouslySetInnerHTML={{ __html: helper }} />} arrow>
                            <IconButton size="small" aria-label="help" color="info">
                                <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    label
                )
            }
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
