import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Box } from '@mui/system';
import { Button, FormControlLabel, FormHelperText, Switch, Typography } from '@mui/material';

import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtFormBlock } from '@Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '@Components/CmtTextField/CmtTextField';

import { PagesBlocksForm } from '@Apps/Pages/PagesForm/PagesBlocksForm';

export const PagesForm = ({ handleSubmit, initialValues = null }) => {
    const pageSchema = Yup.object().shape({
        title: Yup.string()
            .required('Veuillez renseigner le titre de la page.')
            .max(250, 'Le nom renseigné est trop long.'),
        pageBlocks: Yup.array().of(
            Yup.object().shape({
                content: Yup.string().required('Veuillez renseigner le contenu de votre bloc.'),
            })
        ),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                title: initialValues?.title || '',
                pageBlocks: initialValues?.pageBlocks || [],
            }}
            validationSchema={pageSchema}
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
                <CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une page`}
                >
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre de la page"
                            name="title"
                            error={touched.title && errors.title}
                        />
                    </CmtFormBlock>

                    <CmtFormBlock title="Blocs">
                        <PagesBlocksForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                        />

                        {errors?.pageBlocks && typeof errors?.pageBlocks === 'string' && (
                            <FormHelperText error>{errors.pageBlocks}</FormHelperText>
                        )}
                    </CmtFormBlock>
                    <Box display="flex" justifyContent="flex-end">
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
                </CmtPageWrapper>
            )}
        </Formik>
    );
}

