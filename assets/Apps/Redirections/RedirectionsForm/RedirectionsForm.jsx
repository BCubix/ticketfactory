import React from 'react';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { REDIRECTION_TYPES } from '../../../Constant';

export const RedirectionsForm = ({ handleSubmit, initialValues = null }) => {
    const redirectionSchema = Yup.object().shape({
        redirectType: Yup.string().required('Veuillez renseigner le type de redirection.'),
        redirectFrom: Yup.string().required("Veuillez renseigner l'url à rediriger."),
        redirectTo: Yup.string().required("Veuillez renseigner l'url de destination."),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                redirectType: initialValues?.redirectType || '',
                redirectFrom: initialValues?.redirectFrom || '',
                redirectTo: initialValues?.redirectTo || '',
            }}
            validationSchema={redirectionSchema}
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
                <CmtPageWrapper component="form" onSubmit={handleSubmit}>
                    <Typography component="h1" variant={'h5'}>
                        {initialValues ? 'Modification' : 'Création'} d'une redirection
                    </Typography>
                    <CmtFormBlock title="Informations générales">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6} lg={4}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="redirectionType-label" size="small">
                                        Type de redirection
                                    </InputLabel>
                                    <Select
                                        labelId="redirectionType-label"
                                        size="small"
                                        id="redirectionType"
                                        value={values.redirectType}
                                        label="Type de redirection"
                                        onChange={(e) => {
                                            setFieldValue('redirectType', e.target.value);
                                        }}
                                        onBlur={handleBlur}
                                        name={'redirectType'}
                                        error={touched.redirectType && Boolean(errors.redirectType)}
                                    >
                                        {REDIRECTION_TYPES.map((item, index) => (
                                            <MenuItem value={item.value} key={index}>
                                                <ListItemText>{item.label}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText error>
                                        {touched.redirectType && errors.redirectType}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <CmtTextField
                                    value={values.redirectFrom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Url source"
                                    name="redirectFrom"
                                    error={touched.redirectFrom && errors.redirectFrom}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} lg={4}>
                                <CmtTextField
                                    value={values.redirectTo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Url de destination"
                                    name="redirectTo"
                                    error={touched.redirectTo && errors.redirectTo}
                                />
                            </Grid>
                        </Grid>
                    </CmtFormBlock>
                    <Box display="flex" justifyContent={'flex-end'}>
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
