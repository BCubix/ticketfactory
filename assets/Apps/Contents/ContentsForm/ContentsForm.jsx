import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import * as Yup from 'yup';
import { DisplayContentForm } from './DisplayContentForm';
import { useState } from 'react';

export const ContentsForm = ({ initialValues = null, handleSubmit, selectedContentType }) => {
    const [initValue, setInitValue] = useState(null);

    let contentValidationSchema = Yup.object().shape({
        contentType: Yup.number().required('Veuillez renseigner le type de contenu.'),
    });

    useEffect(() => {
        if (initialValues) {
            setInitValue({
                active: initialValues?.active || false,
                fields: initialValues?.fields,
                contentType: initialValues?.contentType?.id || selectedContentType?.id,
            });

            return;
        }

        let fields = [];

        selectedContentType?.fields?.forEach((el) => {
            fields.push({
                name: el.name,
                value: '',
            });
        });

        setInitValue({
            active: false,
            fields: fields,
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
                console.log(values);
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
                <CmtPageWrapper component="form" onSubmit={handleSubmit}>
                    <Typography component="h1" variant={'h5'}>
                        {initialValues ? 'Modification' : 'Création'} d'un contenu
                    </Typography>

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
