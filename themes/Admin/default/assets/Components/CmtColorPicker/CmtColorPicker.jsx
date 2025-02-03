import React, { useState, useEffect } from 'react';
import { Grid, Paper, Zoom, Box, TextField,InputLabel } from '@mui/material';

import Coloris from '@melloware/coloris';
import '@melloware/coloris/dist/coloris.css';

export const CmtColorPicker = ({values, setFieldValue, ...props}) => {
    useEffect(() => {
        Coloris.init();
        Coloris({ el: '#color-picker-input', onChange: (color) => {
            const newColor = color;
            setFieldValue('color', newColor);;
        } });
    }, []);


    return (
        <Box
            sx={{ marginTop: 4, fontSize: 12, cursor: 'pointer', color: (theme) => theme.palette.info.main }}
        >
            <InputLabel id={`color-label`} required sx={{ fontSize: '12px' }}>
                Couleur
            </InputLabel>
            <TextField
                id="color-picker-input"
                type="text"
                data-coloris
                defaultValue={values?.color}
                InputProps={{
                    style: { cursor: 'pointer', padding: '0px', textAlign: 'center'}
                }}
                variant="outlined"
                size="small"
            />
        </Box>
    );
};

