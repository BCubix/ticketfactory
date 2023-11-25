import React from 'react';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';
import { Button } from '@mui/material';

export const CmtActiveBlock = ({ values, setFieldValue, isSubmitting, initialValues, formCrud, ...props }) => {
    return (
        <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
            {formCrud?.submitLine?.activeInput && <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text={formCrud?.submitLine?.activeLabel} />}

            <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                {initialValues ? 'Modifier' : 'Créer'}
            </Button>
        </Box>
    );
};
