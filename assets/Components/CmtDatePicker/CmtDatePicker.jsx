import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Box, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState } from 'react';

export const CmtDatePicker = ({
    openToYear = false,
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
                <DatePicker
                    allowKeyboardControl
                    disableCloseOnSelect={false}
                    openTo={openToYear ? 'year' : 'day'}
                    inputFormat="DD/MM/YYYY"
                    clearable
                    allowSameDateSelection
                    name={name}
                    fullWidth
                    open={open}
                    value={value}
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

                        params.inputProps.placeholder = 'jj/mm/aaaa';
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
