import React from 'react';
import { Formik } from 'formik';

import { Button, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import { Component } from '@/AdminService/Component';
import * as Yup from 'yup';

const IMAGETYPE_WEBP = '18';
const IMAGETYPE_PNG = '3';
const IMAGETYPE_JPG = '2';

export const ImageFormatsParametersForm = ({ initialValues = null, handleSubmit }) => {
    const imageFormatsParameterSchema = Yup.object().shape({
        core_image_webp_quality: Yup.number()
            .required("Veuillez renseigner la qualité d'image WEBP.")
            .min(0, 'Veuillez renseigner un nombre valide.')
            .max(100, 'Veuillez renseigner un nombre valide.'),
        core_image_png_quality: Yup.number()
            .required("Veuillez renseigner la qualité d'image PNG.")
            .min(0, 'Veuillez renseigner un nombre valide.')
            .max(100, 'Veuillez renseigner un nombre valide.'),
        core_image_jpg_quality: Yup.number()
            .required("Veuillez renseigner la qualité d'image JPG.")
            .min(0, 'Veuillez renseigner un nombre valide.')
            .max(100, 'Veuillez renseigner un nombre valide.'),
    });

    return (
        <Formik
            initialValues={{
                core_image_webp_quality: initialValues?.core_image_webp_quality || '',
                core_image_png_quality: initialValues?.core_image_png_quality || '',
                core_image_jpg_quality: initialValues?.core_image_jpg_quality || '',
                core_image_format: initialValues?.core_image_format || IMAGETYPE_WEBP,
                core_image_to_crop: initialValues?.core_image_to_crop || false,
            }}
            validationSchema={imageFormatsParameterSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtFormBlock title="Paramètres des images" sx={{ mt: 5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} md={4}>
                            <Component.CmtTextField
                                value={values.core_image_webp_quality}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Qualité d'image WEBP"
                                name="core_image_webp_quality"
                                error={touched.core_image_webp_quality && errors.core_image_webp_quality}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Component.CmtTextField
                                value={values.core_image_png_quality}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Qualité d'image PNG"
                                name="core_image_png_quality"
                                error={touched.core_image_png_quality && errors.core_image_png_quality}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Component.CmtTextField
                                value={values.core_image_jpg_quality}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Qualité d'image JPG"
                                name="core_image_jpg_quality"
                                error={touched.core_image_jpg_quality && errors.core_image_jpg_quality}
                                required
                            />
                        </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="imageFormat-label" size="small" required>
                            Préférence de compression
                        </InputLabel>
                        <Select
                            id="selectImageFormat"
                            label="Préférence de compression"
                            labelId="imageFormat-label"
                            variant="standard"
                            size="small"
                            value={values.core_image_format}
                            onChange={(e) => {
                                setFieldValue('core_image_format', e.target.value);
                            }}
                        >
                            <MenuItem key={'webp'} value={IMAGETYPE_WEBP} id={`selectImageFormatValue-webp`}>
                                Compression WEBP
                            </MenuItem>
                            <MenuItem key={'png'} value={IMAGETYPE_PNG} id={`selectImageFormatValue-png`}>
                                Compression PNG
                            </MenuItem>
                            <MenuItem key={'jpg'} value={IMAGETYPE_JPG} id={`selectImageFormatValue-jpg`}>
                                Compression JPG
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <FormLabel id="core_image_to_crop-label" className="required-input" sx={{ fontSize: '12px' }}>
                            Supprimer les anciennes miniatures
                        </FormLabel>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Compléter avec des espaces blancs</Typography>
                            <Switch
                                label="Supprimer les anciennes miniatures"
                                variant="standard"
                                checked={Boolean(values.core_image_to_crop)}
                                onChange={(e) => {
                                    setFieldValue('core_image_to_crop', e.target.checked);
                                }}
                            />
                            <Typography>Rogner les images</Typography>
                        </Stack>
                    </FormControl>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={isSubmitting}>
                                Valider
                            </Button>
                        </Box>
                    </Box>
                </Component.CmtFormBlock>
            )}
        </Formik>
    );
};
