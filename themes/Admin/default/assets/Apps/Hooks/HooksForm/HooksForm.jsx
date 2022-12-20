import React, { useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { Box } from "@mui/system";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
} from "@mui/material";

export const HooksForm = ({ handleSubmit, modulesActive }) => {
    const moduleSchema = Yup.object().shape({
        moduleName: Yup.string().required('Veuillez selectionner un module.'),
        hookName: Yup.string().required('Veuillez selectionner un hook.'),
    });

    const modules = useMemo(() => {
        const modules = {};
        modulesActive.map(({ name, displayName, hooks }) => {
            modules[name] = { displayName: displayName, hooks: hooks };
        });
        return modules;
    }, [modulesActive]);

    return (
        <Formik
            initialValues={{
                moduleName: '',
                hookName: '',
            }}
            validationSchema={moduleSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                //handleSubmit(values);
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
                  setFieldTouched,
                  isSubmitting,
              }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title="Création d'un hook"
                >
                    <Component.CmtFormBlock title={'Informations générales'}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth sx={{ marginBlock: 3 }}>
                                    <InputLabel id={`module-label`} size="small" required>
                                        Module
                                    </InputLabel>
                                    <Select
                                        labelId={`module-label`}
                                        size="small"
                                        variant="standard"
                                        id={'module'}
                                        label={'Module'}
                                        value={values.moduleName}
                                        onChange={(e) => {
                                            setFieldValue('hookName', '');
                                            setFieldValue('moduleName', e.target.value);
                                        }}
                                    >
                                        {Object.entries(modules).map(([name, { displayName }], index) => (
                                            <MenuItem value={name} key={index}>
                                                <ListItemText>{displayName}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.moduleName && typeof errors?.moduleName === 'string' && (
                                        <FormHelperText error>{errors.moduleName}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth sx={{ marginBlock: 3 }}>
                                    <InputLabel id={`hook-label`} size="small" required>
                                        Hook
                                    </InputLabel>
                                    <Select
                                        labelId={`hook-label`}
                                        size="small"
                                        variant="standard"
                                        id={'hook'}
                                        label={'Hook'}
                                        value={values.hookName}
                                        onChange={(e) => {
                                            setFieldValue('hookName', e.target.value);
                                        }}
                                    >
                                        {values.moduleName !== '' && modules[values.moduleName].hooks.map((name, index) => (
                                            <MenuItem value={name} key={index}>
                                                <ListItemText>{name}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.hookName && typeof errors?.hookName === 'string' && (
                                        <FormHelperText error>{errors.hookName}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            id="submitForm"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            Créer
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};