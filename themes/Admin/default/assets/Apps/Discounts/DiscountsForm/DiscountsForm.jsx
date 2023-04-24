import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControl, Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

const DISCOUNT_UNIT = [
    { label: 'Euros', value: '€' },
    { label: 'Pour cent', value: '%' },
];

export const DiscountsForm = ({ handleSubmit, initialValues = null }) => {
    const discountSchema = Yup.object().shape({
        code: Yup.string().required('Veuillez renseigner le code de réduction.'),
        discount: Yup.number().required('Veuillez renseigner le montant de la réduction.'),
        unit: Yup.string().required("Veuillez choisir l'unité de la réduction."),
    });

    return (
        <Formik
            initialValues={{
                code: initialValues?.code || '',
                discount: initialValues?.discount || '',
                unit: initialValues?.unit || '',
                active: initialValues?.active || false,
            }}
            validationSchema={discountSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper title={`${initialValues ? 'Modification' : 'Création'} d'un coupon de réduction`} component="form" onSubmit={handleSubmit}>
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={4}>
                                <Component.CmtTextField
                                    value={values.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Code de réduction"
                                    name="code"
                                    error={touched.code && errors.code}
                                    required
                                />
                            </Grid>
                            <Grid item xs={7} sm={4}>
                                <Component.CmtTextField
                                    value={values.discount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Montant de la réduction"
                                    name="discount"
                                    error={touched.discount && errors.discount}
                                    type="number"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Component.CmtSelectField
                                    label="Unité de réduction"
                                    required
                                    name={`unit`}
                                    value={values.unit}
                                    list={DISCOUNT_UNIT}
                                    getValue={(item) => item.value}
                                    getName={(item) => item.label}
                                    setFieldValue={setFieldValue}
                                    errors={touched.unit && errors.unit}
                                    handleBlur={handleBlur}
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'} sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Coupon actif ?" />

                        <Button type="submit" variant="contained" disabled={isSubmitting} id="submitForm">
                            Modifier
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
