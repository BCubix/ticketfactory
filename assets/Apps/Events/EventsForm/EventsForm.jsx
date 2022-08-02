import {
    Card,
    CardContent,
    FormHelperText,
    Grid,
    InputLabel,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import LightEditor from '../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../Components/Editors/LightEditor/sc.LightEditorFormControl';
import { PageWrapper } from '../../../Components/Page/PageWrapper/sc.PageWrapper';

export const EventsForm = ({ handleSubmit, initialValues = null }) => {
    return (
        <Formik
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          active: true,
                          name: '',
                          description: '',
                          eventDates: [],
                          eventPrices: [],
                          eventCategory: {},
                          room: {},
                          season: {},
                      }
            }
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);

                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                setFieldTouched,
                setFieldValue,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <PageWrapper component="form" onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        Informations générale
                                    </Typography>

                                    <Box mt={3}>
                                        <TextField
                                            margin="normal"
                                            size="small"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            fullWidth
                                            id="name"
                                            label="Nom"
                                            name="name"
                                            autoComplete="name"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                            sx={{ marginBottom: 3 }}
                                        />

                                        <InputLabel id="description">Description</InputLabel>
                                        <LightEditorFormControl>
                                            <LightEditor
                                                labelId="description"
                                                value={values.description}
                                                onBlur={() =>
                                                    setFieldTouched('description', true, false)
                                                }
                                                onChange={(val) => {
                                                    setFieldValue('description', val);
                                                }}
                                            />
                                            <FormHelperText error>
                                                {touched.description && errors.description}
                                            </FormHelperText>
                                        </LightEditorFormControl>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </PageWrapper>
            )}
        </Formik>
    );
};
