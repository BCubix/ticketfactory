import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Component } from '@/AdminService/Component';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box } from '@mui/system';

export const PageBlocksForm = ({ handleSubmit, initialValues = null, modelValues = null }) => {
    const [view, setView] = useState('xl');
    const initValues = initialValues || modelValues;

    const pageBlockSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de votre block.').max(250, 'Le nom renseigné est trop long.'),
    });

    return (
        <Formik
            initialValues={{
                name: initValues?.name || '',
                columns:
                    initValues?.columns?.map((element) => ({
                        content: element?.content || '',
                        xs: element?.xs || 12,
                        s: element?.s || 12,
                        m: element?.m || 12,
                        l: element?.l || 12,
                        xl: element?.xl || 12,
                    })) || [],
            }}
            validationSchema={pageBlockSchema}
            onSubmit={(values, { setSubmitting }) => {
                if (handleSubmit) {
                    handleSubmit(values);
                }
                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un bloc de page`}>
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom du bloc"
                            name="name"
                            error={touched.name && errors.name}
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Contenu" position="relative">
                        <Box sx={{ paddingLeft: 5 }} minHeight={200}>
                            <ToggleButtonGroup
                                orientation="vertical"
                                value={view}
                                exclusive
                                onChange={(e, newValue) => setView(newValue)}
                                size="small"
                                sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}
                            >
                                <ToggleButton value="xs" aria-label="XS">
                                    XS
                                </ToggleButton>

                                <ToggleButton value="s" aria-label="S">
                                    S
                                </ToggleButton>

                                <ToggleButton value="m" aria-label="M">
                                    M
                                </ToggleButton>

                                <ToggleButton value="l" aria-label="L">
                                    L
                                </ToggleButton>

                                <ToggleButton value="xl" aria-label="XL">
                                    XL
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <Component.PageBlockColumnPart values={values} media={view} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                        </Box>
                    </Component.CmtFormBlock>
                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
