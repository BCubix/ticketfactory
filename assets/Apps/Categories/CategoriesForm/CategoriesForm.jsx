import { Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { ParentCategoryPartForm } from './ParentCategoryPartForm';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';

export const CategoriesForm = ({ handleSubmit, initialValues = null, categoriesList = null }) => {
    const categorySchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
        parent: Yup.string().when('mustHaveParent', (mustHaveParent) => {
            if (mustHaveParent) {
                return Yup.string().required('Veuillez renseigner une catégorie parente.');
            }
        }),
    });

    if (!categoriesList) {
        return <></>;
    }

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                parent: initialValues?.parent?.id || '',
                mustHaveParent: !initialValues || Boolean(initialValues?.parent),
            }}
            validationSchema={categorySchema}
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
                <CmtPageWrapper
                    component="form"
                    onSubmit={handleSubmit}
                    title={`${initialValues ? 'Modification' : 'Création'} d'une catégorie`}
                >
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                            required
                        />

                        {values?.mustHaveParent && (
                            <ParentCategoryPartForm
                                values={values}
                                categoriesList={categoriesList}
                                setFieldValue={setFieldValue}
                                touched={touched}
                                errors={errors}
                            />
                        )}
                    </CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={values.active}
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
};
