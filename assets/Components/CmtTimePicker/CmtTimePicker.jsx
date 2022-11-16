import React, { useState } from 'react';
import moment from 'moment';
import { Box, TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export const CmtTimePicker = ({
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
    required = false,
    maxWidth = '100%',
    ...rest
}) => {
    const [open, setOpen] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box md={2} width="100%" maxWidth={maxWidth}>
                <TimePicker
                    allowKeyboardControl
                    disableCloseOnSelect={false}
                    openTo={'hours'}
                    inputFormat="HH:mm"
                    clearable
                    ampm={false}
                    allowSameDateSelection
                    name={name}
                    fullWidth
                    open={open}
                    value={value ? moment(value, 'HH:mm') : null}
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
                        params.required = required;

                        params.inputProps.placeholder = 'hh:mm';
                        params.InputProps.endAdornment = null;

                        return (
                            <TextField
                                {...params}
                                variant={inputVariant}
                                helperText={error}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                fullWidth={fullWidth}
                                color="primary"
                                size={inputSize}
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
