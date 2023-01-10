import React from 'react';
import { Formik } from 'formik';

import {
    Button,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";

import { Component } from '@/AdminService/Component';

export const ImageFormatGenerateForm = ({ imageFormats, handleSubmit }) => {
    return (
        <Formik
            initialValues={{
                formatId: -1,
                deleteOldThumbnails: false,
            }}
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
                setFieldTouched,
                isSubmitting
            }) => (
                <Component.CmtFormBlock title="Génération des miniatures" sx={{ mt: 5 }}>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="imageFormat-label" size="small" className="required-input">
                            Format d'image
                        </InputLabel>
                        <Select
                            id="selectImageFormat"
                            label="Format d'image"
                            labelId="imageFormat-label"
                            variant="standard"
                            size="small"
                            value={values.formatId}
                            onChange={(e) => {
                                setFieldValue('formatId', e.target.value);
                            }}
                        >
                            <MenuItem key={'tous'} value={-1} id={`selectImageFormatValue-tous`}>
                                Tous
                            </MenuItem>
                            {imageFormats?.map(({ id, name }, index) => (
                                <MenuItem key={index} value={id} id={`selectImageFormatValue-${id}`}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <FormLabel id="deleteOldThumbnails-label" className="required-input" sx={{ fontSize: '12px' }}>
                            Supprimer les anciennes miniatures
                        </FormLabel>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>
                                Ne pas supprimer
                            </Typography>
                            <Switch
                                label="Supprimer les anciennes miniatures"
                                variant="standard"
                                checked={Boolean(values.deleteOldThumbnails)}
                                onChange={(e) => {
                                    setFieldValue('deleteOldThumbnails', e.target.checked);
                                }}
                            />
                            <Typography>
                                Supprimer
                            </Typography>
                        </Stack>
                    </FormControl>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Valider
                            </Button>
                        </Box>
                    </Box>
                </Component.CmtFormBlock>
            )}
        </Formik>
    );
};