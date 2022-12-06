import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, FormHelperText, InputLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const TagsForm = ({ handleSubmit, initialValues = null }) => {
    const tagSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom du tag.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                description: initialValues?.description || '',
            }}
            validationSchema={tagSchema}
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
                setFieldTouched,
                isSubmitting,
            }) => (
                <Component.CmtPageWrapper
                    title={`${initialValues ? 'Modification' : 'Création'} d'un tag`}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                            sx={{ marginBottom: 3 }}
                            required
                        />
                        <InputLabel id="description">Description</InputLabel>

                        <Component.LightEditorFormControl id="descriptionControl">
                            <Component.LightEditor
                                labelId="description"
                                value={values.description}
                                onBlur={() => setFieldTouched('description', true, false)}
                                onChange={(val) => {
                                    setFieldValue('description', val);
                                }}
                            />
                            <FormHelperText error>
                                {touched.description && errors.description}
                            </FormHelperText>
                        </Component.LightEditorFormControl>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={values.active}
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
                            id="submitForm"
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
