import { Button, FormControlLabel, FormHelperText, InputLabel, Switch } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { LightEditor } from '../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../Components/Editors/LightEditor/sc.LightEditorFormControl';

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
                <CmtPageWrapper
                    title={`${initialValues ? 'Modification' : 'Création'} d'un tag`}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
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

                        <LightEditorFormControl>
                            <LightEditor
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
                        </LightEditorFormControl>
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
