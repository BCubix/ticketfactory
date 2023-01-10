import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';

export const EventsForm = ({ handleSubmit, initialValues = null, categoriesList, roomsList, seasonsList, tagsList }) => {
    if (!categoriesList || !roomsList || !seasonsList || !tagsList) {
        return <></>;
    }

    const eventSchema = Yup.object().shape({
        name: Yup.string().required("Veuillez renseigner le nom de l'évènement.").max(250, "Le nom de l'évènement est trop long"),
        chapo: Yup.string().required('Veuillez renseigner le chapô.'),
        eventCategories: Yup.array().min(1, 'Veuillez renseigner au moins une catégorie.'),
        mainCategory: Yup.string().required('Veuillez renseigner la catégorie principale.'),
        description: Yup.string().required('Veuillez renseigner une description.'),
        eventDateBlocks: Yup.array()
            .of(
                Yup.object().shape({
                    name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
                    eventDates: Yup.array()
                        .of(
                            Yup.object().shape({
                                eventDate: Yup.string().required('Veuillez renseigner la date.'),
                                state: Yup.string().required('Veuillez renseigner le status de cette date.'),
                                reportDate: Yup.string().when('state', (state) => {
                                    if (state === 'delayed') {
                                        return Yup.string().required('Veuillez renseigner la nouvelle date.');
                                    } else {
                                        return Yup.string().nullable();
                                    }
                                }),
                            })
                        )
                        .min(1, 'Veuillez renseigner au moins une date.'),
                })
            )
            .min(1, 'Veuillez renseigner au moins un bloc de dates.'),
        eventPriceBlocks: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Veuillez renseigner le nom du bloc.').max(250, 'Le nom du bloc est trop long'),
                eventPrices: Yup.array()
                    .of(
                        Yup.object().shape({
                            name: Yup.string().required('Veuillez renseigner le nom du tarif.'),
                            price: Yup.number().required('Veuillez renseigner le prix').min(0, 'Veuillez renseigner un prix valide.'),
                        })
                    )
                    .min(1, 'Veuillez renseigner au moins un prix.'),
            })
        ),
    });

    return (
        <Formik
            initialValues={{
                active: initialValues?.active || false,
                name: initialValues?.name || '',
                chapo: initialValues?.chapo || '',
                description: initialValues?.description || '',
                eventDateBlocks: initialValues?.eventDateBlocks || [{ name: 'Dates', eventDates: [] }],
                eventPriceBlocks: initialValues?.eventPriceBlocks || [{ name: 'Tarifs', eventPrices: [] }],
                eventCategories: initialValues?.eventCategories ? initialValues?.eventCategories?.map((el) => el.id) : [],
                room: initialValues?.room?.id || '',
                season: initialValues?.season?.id || '',
                tags: initialValues?.tags ? initialValues?.tags?.map((el) => el.id) : [],
                mainCategory: initialValues?.mainCategory?.id || '',
                multiplePriceBlock: initialValues?.eventPriceBlocks?.length > 1 || false,
                multipleDateBlock: initialValues?.eventDateBlocks?.length > 1 || false,
                eventMedias:
                    initialValues?.eventMedias?.map((el) => ({
                        mainImg: el.mainImg,
                        position: el.position,
                        id: el.media?.id,
                    })) || [],
                slug: initialValues?.slug || '',
                editSlug: false,
            }}
            validationSchema={eventSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldTouched, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <Component.CmtPageWrapper component="form" onSubmit={handleSubmit} title={`${initialValues ? 'Modification' : 'Création'} d'un évènement`}>
                    <Component.CmtTabs
                        containerStyle={{ mt: 3 }}
                        list={Tab.EventsFormTabList(values, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue,
                            roomsList, seasonsList, categoriesList, tagsList, initialValues)}
                    />

                    <Box display="flex" justifyContent="flex-end" sx={{ pt: 3, pb: 2 }}>
                        <Component.CmtActiveField values={values} setFieldValue={setFieldValue} text="Evènement actif ?" />

                        <Button type="submit" variant="contained" id="submitForm" disabled={isSubmitting}>
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Component.CmtPageWrapper>
            )}
        </Formik>
    );
};
