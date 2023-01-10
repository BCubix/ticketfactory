import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, FormControlLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const NewsForm = ({ handleSubmit, initialValues = null, mediasList }) => {
    const newsSchema = Yup.object().shape({
        title: Yup.string()
            .required('Veuillez renseigner le titre de la page.')
            .max(250, 'Le nom renseigné est trop long.'),
        description: Yup.string().required('Veuillez renseigner la description.'),
        newsBlocks: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required('Veuillez renseigner le titre de votre bloc.'),
                content: Yup.string().required('Veuillez renseigner le contenu de votre bloc.'),
            })
        ),
        mainMedia: Yup.object().required('Veuillez renseigner une image principale.').nullable(),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                homeDisplayed: initialValues?.homeDisplayed || false,
                title: initialValues?.title || '',
                subtitle: initialValues?.subtitle || '',
                description: initialValues?.description || '',
                newsBlocks: initialValues?.newsBlocks || [],
                mainMedia: initialValues?.mainMedia || null,
            }}
            validationSchema={newsSchema}
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
                  isSubmitting,
              }) => (
                <Component.CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une actualité`}
                >
                    <Component.CmtFormBlock title="Informations générales">
                        <Component.CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre de l'actualité"
                            name="title"
                            error={touched.title && errors.title}
                            required
                        />

                        <Component.CmtTextField
                            value={values.subtitle}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Sous-titre de l'actualité"
                            name="subtitle"
                            error={touched.subtitle && errors.subtitle}
                        />

                        <Component.CmtTextField
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Description"
                            name="description"
                            error={touched.description && errors.description}
                            multiline
                            rows={4}
                            required
                        />

                        <Component.NewsMainMediaPartForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            mediasList={mediasList}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            name="mainMedia"
                        />
                    </Component.CmtFormBlock>

                    <Component.CmtFormBlock title="Blocs">
                        <Component.NewsBlocksForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                        />

                        {errors?.newsBlocks && typeof errors?.newsBlocks === 'string' && (
                            <Component.FormHelperText error>{errors.newsBlocks}</Component.FormHelperText>
                        )}
                    </Component.CmtFormBlock>

                    <Box display="flex" justifyContent="flex-end">
                        <FormControlLabel
                            sx={{ marginRight: 5, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={Boolean(values.homeDisplayed)}
                                    onChange={(e) => {
                                        setFieldValue('homeDisplayed', e.target.checked);
                                    }}
                                />
                            }
                            label={"Afficher sur la page d'accueil ?"}
                            labelPlacement="start"
                        />
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
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
}

export default { NewsForm };
