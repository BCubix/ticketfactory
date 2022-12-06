import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch,
} from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const RedirectionsForm = ({ handleSubmit, initialValues = null }) => {
    const redirectionSchema = Yup.object().shape({
        redirectType: Yup.string().required('Veuillez renseigner le type de redirection.'),
        redirectFrom: Yup.string()
            .required("Veuillez renseigner l'url à rediriger.")
            .max(1000, "l'url renseigné est trop longue.")
            .matches(
                /^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                'Url invalide'
            ),
        redirectTo: Yup.string()
            .required("Veuillez renseigner l'url de destination.")
            .max(1000, "l'url renseigné est trop longue.")
            .matches(
                /^(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                'Url invalide'
            ),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                redirectType: initialValues?.redirectType || '',
                redirectFrom: initialValues?.redirectFrom || '',
                redirectTo: initialValues?.redirectTo || '',
            }}
            validationSchema={redirectionSchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une redirection`}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6} lg={4}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="redirectionType-label" size="small" required>
                                        Type de redirection
                                    </InputLabel>
                                    <Select
                                        labelId="redirectionType-label"
                                        size="small"
                                        id="redirectionType"
                                        variant="standard"
                                        value={values.redirectType}
                                        label="Type de redirection"
                                        onChange={(e) => {
                                            setFieldValue('redirectType', e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        name={'redirectType'}
                                        error={touched.redirectType && Boolean(errors.redirectType)}
                                        required
                                    >
                                        {Constant.REDIRECTION_TYPES.map((item, index) => (
                                            <MenuItem
                                                value={item.value}
                                                key={index}
                                                id={`redirectionTypeValue-${item.value}`}
                                            >
                                                <ListItemText>{item.label}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error>
                                        {touched.redirectType && errors.redirectType}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <Component.CmtTextField
                                    value={values.redirectFrom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Url source"
                                    name="redirectFrom"
                                    error={touched.redirectFrom && errors.redirectFrom}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <Component.CmtTextField
                                    value={values.redirectTo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Url de destination"
                                    name="redirectTo"
                                    error={touched.redirectTo && errors.redirectTo}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
                                    id="active"
                                    onChange={(e) => {
                                        setFieldValue('active', e.target.checked);
                                    }}
                                />
                            }
                            label={'Activé ?'}
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
