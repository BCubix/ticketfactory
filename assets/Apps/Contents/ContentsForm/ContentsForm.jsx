import { Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import * as Yup from 'yup';
import { DisplayContentForm } from './DisplayContentForm';
import { useState } from 'react';
import ContentModules from './ContentModules';
import { CONTENT_MODULES_EXTENSION } from '../../../Constant';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType }) => {
    const [initValue, setInitValue] = useState(null);

    const getContentModules = useMemo(() => {
        return ContentModules();
    }, []);

    let contentValidationSchema = Yup.object().shape({
        contentType: Yup.number().required('Veuillez renseigner le type de contenu.'),
    });

    useEffect(() => {
        if (initialValues) {
            setInitValue({
                active: initialValues?.active || false,
                fields: { ...initialValues?.fields },
                title: initialValues?.title || '',
                contentType: initialValues?.contentType?.id || selectedContentType?.id,
            });

            return;
        }

        const formModules = getContentModules;

        let fields = {};

        selectedContentType?.fields?.forEach((el) => {
            const moduleName =
                String(el.type).charAt(0).toUpperCase() +
                el.type?.slice(1) +
                CONTENT_MODULES_EXTENSION;

            fields[el.name] = formModules[moduleName]?.getInitialValue(el) || '';
        });

        setInitValue({
            active: false,
            fields: fields,
            title: '',
            contentType: selectedContentType?.id,
        });
    }, []);

    if (!initValue) {
        return <></>;
    }

    return (
        <Formik
            initialValues={initValue}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
            validationSchema={contentValidationSchema}
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
                    title={`${initialValues ? 'Modification' : 'Création'} d'un contenu`}
                >
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Titre du contenu"
                            name="title"
                            error={touched.title && errors.title}
                            required
                        />
                    </CmtFormBlock>

                    <CmtFormBlock title="Formulaire">
                        <DisplayContentForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            contentType={selectedContentType}
                            contentModules={getContentModules}
                        />
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
};
