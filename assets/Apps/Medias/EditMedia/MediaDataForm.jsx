import { Button, FormControlLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const MediaDataForm = ({ media, handleSubmit }) => {
    const mediaSchema = Yup.object().shape({
        title: Yup.string().required('Veuillez renseigner le titre du fichier'),
    });

    return (
        <Formik
            initialValues={{
                alt: media?.alt || '',
                title: media?.title || '',
                legend: media?.legend || '',
                description: media?.description || '',
                active: media?.active || false,
            }}
            validationSchema={mediaSchema}
            onSubmit={(values, { setSubmitting }) => {
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
                <Box component="form" onSubmit={handleSubmit} sx={{ margin: 5 }}>
                    <CmtTextField
                        value={values.alt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Texte alternatif"
                        name="alt"
                        error={touched.alt && errors.alt}
                    />

                    <CmtTextField
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Titre"
                        name="title"
                        error={touched.title && errors.title}
                        sx={{ mt: 10 }}
                    />

                    <CmtTextField
                        value={values.legend}
                        multiline
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Légende"
                        name="legend"
                        error={touched.legend && errors.legend}
                        sx={{ mt: 10 }}
                    />

                    <CmtTextField
                        value={values.description}
                        multiline
                        rows={3}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Description"
                        name="description"
                        error={touched.description && errors.description}
                        sx={{ mt: 10 }}
                    />

                    <Box display="flex" justifyContent={'flex-end'} sx={{ my: 5 }}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
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
                            Modifier
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};