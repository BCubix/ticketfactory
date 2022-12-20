import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Component } from '@/AdminService/Component';
import { Box } from "@mui/system";
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch
} from "@mui/material";

export const HooksForm = ({ handleSubmit, modules }) => {
    const [indexModule, setIndexModule] = useState(0);

    return (
        <Formik
            initialValues={{
                moduleName: '',
                hookName: '',
            }}
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
                                    <InputLabel id={`module-label`} size="small">
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
                                            console.log('target', e.target.innerText);
                                            setFieldValue('moduleName', e.target.value);
                                        }}
                                    >
                                        {modules?.map(({ name, displayName }, index) => (
                                            <MenuItem name={name} value={name} key={index}>
                                                <ListItemText>{displayName}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth sx={{ marginBlock: 3 }}>
                                    <InputLabel id={`hook-label`} size="small">
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
                                        {indexModule < modules.length && modules[indexModule].hooks.map(({ name, displayName }, index) => (
                                            <MenuItem value={name} key={index}>
                                                <ListItemText>{displayName}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
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