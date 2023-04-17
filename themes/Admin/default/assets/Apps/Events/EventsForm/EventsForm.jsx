import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Tab } from '@/AdminService/Tab';

export const EventsForm = ({ handleSubmit, initialValues = null, translateInitialValues = null, categoriesList, roomsList, seasonsList, tagsList }) => {
    const initValues = translateInitialValues || initialValues;

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
                active: initValues?.active || false,
                name: initValues?.name || '',
                chapo: initValues?.chapo || '',
                description: initValues?.description || '',
                eventDateBlocks: initValues?.eventDateBlocks?.map((el) => ({
                    ...el,
                    lang: el?.lang?.id || '',
                    eventDates: el.eventDates?.map((date) => ({ ...date, lang: date.lang.id || '' })),
                })) || [{ name: 'Dates', eventDates: [], lang: initValues?.lang?.id || '' }],
                eventPriceBlocks: initValues?.eventPriceBlocks?.map((el) => ({
                    ...el,
                    lang: el?.lang?.id || '',
                    eventPrices: el?.eventPrices?.map((price) => ({ ...price, lang: price?.lang?.id || '' })),
                })) || [{ name: 'Tarifs', eventPrices: [], lang: initValues?.lang?.id || '' }],
                eventCategories: initValues?.eventCategories ? initValues?.eventCategories?.map((el) => el.id) : [categoriesList.id],
                room: initValues?.room?.id || '',
                season: initValues?.season?.id || '',
                tags: initValues?.tags ? initValues?.tags?.map((el) => el.id) : [],
                mainCategory: initValues?.mainCategory?.id || categoriesList.id,
                multiplePriceBlock: initValues?.eventPriceBlocks?.length > 1 || false,
                multipleDateBlock: initValues?.eventDateBlocks?.length > 1 || false,
                eventMedias:
                    initValues?.eventMedias?.map((el) => ({
                        mainImg: el.mainImg,
                        position: el.position,
                        id: el.media?.id,
                        media: el.media,
                    })) || [],
                slug: initValues?.slug || '',
                editSlug: false,
                lang: initValues?.lang?.id || '',
                languageGroup: initValues?.languageGroup || '',
                seo: {
                    metaTitle: initValues?.metaTitle || '',
                    metaDescription: initValues?.metaDescription || '',
                    socialImage: initValues?.socialImage || null,
                    fbTitle: initValues?.fbTitle || '',
                    fbDescription: initValues?.fbDescription || '',
                    twTitle: initValues?.twTitle || '',
                    twDescription: initValues?.twDescription || '',
                },
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
                        list={Tab.EventsFormTabList(
                            values,
                            handleChange,
                            handleBlur,
                            touched,
                            errors,
                            setFieldTouched,
                            setFieldValue,
                            roomsList,
                            seasonsList,
                            categoriesList,
                            tagsList,
                            initValues
                        )}
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
