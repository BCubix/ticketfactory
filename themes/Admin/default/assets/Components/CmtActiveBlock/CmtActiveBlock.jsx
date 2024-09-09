import React from 'react';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';
import { Button } from '@mui/material';

export const CmtActiveBlock = ({ values, setFieldValue, isSubmitting, initialValues, formCrud, createMode, checkFormErrors, submitForm, ...props }) => {
    return (
        <Box className="block-active">
            {formCrud?.submitLine?.activeInput && <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text={formCrud?.submitLine?.activeLabel} />}

            <Button
                type="submit"
                variant="contained"
                id="submitForm"
                disabled={isSubmitting}
                onClick={async (e) => {
                    e.preventDefault();

                    await submitForm();

                    if (checkFormErrors) {
                        checkFormErrors();
                    }
                }}
            >
                {initialValues && !createMode ? 'Modifier' : 'Créer'}
            </Button>
        </Box>
    );
};
