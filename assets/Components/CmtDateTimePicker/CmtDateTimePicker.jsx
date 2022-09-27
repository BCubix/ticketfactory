import React from 'react';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Box, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState } from 'react';

export const CmtDateTimePicker = ({
    openToYear = false,
    disablePast = false,
    value = null,
    setValue,
    name,
    error = null,
    label,
    fullWidth = false,
    onTouched = null,
    inputVariant = 'standard',
    inputSize = 'normal',
    id = '',
    ...rest
}) => {
    const [open, setOpen] = useState(false);

    console.log(error);
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box md={2} width="100%">
                <DateTimePicker
                    allowKeyboardControl
                    disableCloseOnSelect={false}
                    inputFormat="DD/MM/YYYY HH:mm"
                    clearable
                    allowSameDateSelection
                    name={name}
                    ampm={false}
                    fullWidth
                    open={open}
                    value={value || ''}
                    onChange={(date) => {
                        setValue(date);
                    }}
                    onOpen={() => {
                        setOpen(true);

                        if (!onTouched) {
                            return;
                        }

                        onTouched(name, false, false);
                    }}
                    onClose={() => {
                        setOpen(false);

                        if (!onTouched) {
                            return;
                        }

                        onTouched(name, true, false);
                    }}
                    renderInput={(params) => {
                        params.error = Boolean(error);
                        params.label = label;

                        params.inputProps.placeholder = 'jj/mm/aaaa hh:mm';
                        params.InputProps.endAdornment = null;

                        return (
                            <TextField
                                {...params}
                                variant={inputVariant}
                                size={inputSize}
                                helperText={error}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                fullWidth={fullWidth}
                                type="date"
                                color="primary"
                                id={id}
                            />
                        );
                    }}
                    {...rest}
                />
            </Box>
        </LocalizationProvider>
    );
};
