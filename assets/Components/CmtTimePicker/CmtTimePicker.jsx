import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Box, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState } from 'react';
import moment from 'moment';

export const CmtTimePicker = ({
    value = null,
    setValue,
    name,
    error = null,
    label,
    fullWidth = false,
    onTouched = null,
    id = '',
    ...rest
}) => {
    const [open, setOpen] = useState(false);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box md={2} width="100%">
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
                    value={value || null}
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

                        params.inputProps.placeholder = 'hh:mm';
                        params.InputProps.endAdornment = null;

                        return (
                            <TextField
                                {...params}
                                variant="standard"
                                helperText={error}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                fullWidth={fullWidth}
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
