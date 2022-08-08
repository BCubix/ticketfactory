import { Button, FormControlLabel, Switch, Typography, Box } from '@mui/material';
import { Formik } from 'formik';
import React from 'react';
import { PageWrapper } from '../../../Components/Page/PageWrapper/sc.PageWrapper';
import * as Yup from 'yup';
import { EventMainPartForm } from './EventMainPartForm';
import { CmtTabs } from '../../../Components/CmtTabs/CmtTabs';
import { EventsDateForm } from './EventsDateForm';
import { EventsPriceForm } from './EventsPriceForm';
import { EventsDateBlockForm } from './EventsDateBlockForm';
import { EventsPriceBlockForm } from './EventPriceBlockForm';

export const EventsForm = ({
    handleSubmit,
    initialValues = null,
    categoriesList,
    roomsList,
    seasonsList,
    tagsList,
}) => {
    if (!categoriesList || !roomsList || !seasonsList) {
        return <></>;
    }

    const eventSchema = Yup.object().shape({
        name: Yup.string().required("Veuillez renseigner le nom de l'évènement."),
        description: Yup.string().required('Veuillez renseigner une description.'),
    });

    return (
        <Formik
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          active: true,
                          name: '',
                          description: '',
                          eventDateBlocks: [{ name: 'Dates', eventDates: [] }],
                          eventPriceBlocks: [{ name: 'Prix', eventPrices: [] }],
                          eventCategories: [],
                          room: '',
                          season: '',
                          tags: [],
                          mainCategory: '',
                      }
            }
            validationSchema={eventSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                handleSubmit(values);

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
                    <Typography component="h1" variant={'h5'}>
                        {initialValues ? 'Modification' : 'Création'} d'un évènement
                    </Typography>
                    <CmtTabs
                        containerStyle={{ mt: 3 }}
                        list={[
                            {
                                label: 'Evènement',
                                component: (
                                    <EventMainPartForm
                                        values={values}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        touched={touched}
                                        errors={errors}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        roomsList={roomsList}
                                        seasonsList={seasonsList}
                                        categoriesList={categoriesList}
                                        tagsList={tagsList}
                                    />
                                ),
                            },
                            {
                                label: 'Dates',
                                component: (
                                    <EventsDateBlockForm
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        touched={touched}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                ),
                            },
                            {
                                label: 'Prix',
                                component: (
                                    <EventsPriceBlockForm
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        touched={touched}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                ),
                            },
                        ]}
                    />

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
                </PageWrapper>
            )}
        </Formik>
    );
};
